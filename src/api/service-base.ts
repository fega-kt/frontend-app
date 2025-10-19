import type { Result } from '#/api';
import { ResultStatus } from '#/enum';
import { GLOBAL_CONFIG } from '@/global-config';
import { t } from '@/locales/i18n';
import userStore from '@/store/userStore';
import axios, {
  type AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { toast } from 'sonner';

export interface PaginateResult<T> {
  data: T[];
  count: number;
}

const axiosInstance = axios.create({
  baseURL: GLOBAL_CONFIG.apiBaseUrl,
  timeout: 50000,
  headers: { 'Content-Type': 'application/json;charset=utf-8' },
});

// =============================
// 🔐 REQUEST INTERCEPTOR
// =============================
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { accessToken } = userStore.getState().userToken;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error: Error) => Promise.reject(error)
);

// =============================
// 🔁 RESPONSE INTERCEPTOR (Auto Refresh Token + Retry)
// =============================

let isRefreshing = false;
let failedQueue: {
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  <T>(res: AxiosResponse<Result<T>>) => {
    if (!res.data) throw new Error(t('sys.api.apiRequestFailed'));
    const { status, data, message } = res.data;
    if (status === ResultStatus.SUCCESS) return data;
    throw new Error(message || t('sys.api.apiRequestFailed'));
  },
  async (error: AxiosError<Result<unknown>>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    const { response, message } = error || {};
    const errMsg =
      response?.data?.message || message || t('sys.api.errorMessage');

    // 🧩 Handle 401 Unauthorized
    if (response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const { refreshToken } = userStore.getState().userToken;

      if (!refreshToken) {
        userStore.getState().actions.clearUserInfoAndToken();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Nếu đang refresh → đợi xong rồi retry lại
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (token && originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;
      try {
        const res = await axios.post<
          Result<{ accessToken: string; refreshToken: string }>
        >(`${GLOBAL_CONFIG.apiBaseUrl}/auth/refresh`, { refreshToken });

        const { data: refreshData } = res;
        if (refreshData.status !== ResultStatus.SUCCESS)
          throw new Error(refreshData.message);

        const newAccessToken = refreshData.data.accessToken;
        const newRefreshToken = refreshData.data.refreshToken;

        // Cập nhật token vào store
        userStore.getState().actions.setUserToken({
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        });

        processQueue(null, newAccessToken);
        isRefreshing = false;

        // Retry lại request gốc
        if (originalRequest.headers)
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return axiosInstance(originalRequest);
      } catch (err) {
        processQueue(err, null);
        isRefreshing = false;
        userStore.getState().actions.clearUserInfoAndToken();
        return Promise.reject(err);
      }
    }

    // ❌ Lỗi khác 401
    toast.error(errMsg, { position: 'top-right' });
    return Promise.reject(error);
  }
);

// =============================
// 📦 API Client Class
// =============================

interface APIClientOptions {
  endpoint: string;
  populateKeys?: string[];
}

interface RequestOptions {
  endpoint?: string;
  params?: Record<string, unknown>;
  populateKeys?: string[];
}

export class APIClient<T = unknown> {
  protected endpoint: string;
  protected populateKeys?: string[];

  constructor(options: APIClientOptions) {
    this.endpoint = options.endpoint;
    this.populateKeys = options.populateKeys;
  }

  get<R = T>(
    options?: RequestOptions,
    params?: Record<string, unknown>
  ): Promise<R> {
    return this.request<R>({
      method: 'GET',
      url: options?.endpoint
        ? `${this.endpoint}/${options.endpoint}`
        : this.endpoint,
      params: {
        ...params,
        ...(this.populateKeys?.length ? { populate: this.populateKeys } : {}),
      },
    });
  }

  getAll<R = T>(params?: Record<string, unknown>): Promise<R[]> {
    return this.request<R[]>({
      method: 'GET',
      url: this.endpoint,
      params: {
        ...params,
        ...(this.populateKeys?.length ? { populate: this.populateKeys } : {}),
      },
    });
  }

  getById<R = T>(
    id: string | number,
    params?: Record<string, unknown>
  ): Promise<R> {
    return this.request<R>({
      method: 'GET',
      url: `${this.endpoint}/${id}`,
      params,
    });
  }

  post<R = T>(data?: unknown, options?: RequestOptions): Promise<R> {
    return this.request<R>({
      method: 'POST',
      url: options?.endpoint
        ? `${this.endpoint}/${options.endpoint}`
        : this.endpoint,
      data,
    });
  }

  put<R = T>(
    id: string | number,
    data: Partial<T> | FormData,
    config?: Record<string, unknown>
  ): Promise<R> {
    return this.request<R>({
      method: 'PUT',
      url: `${this.endpoint}/${id}`,
      data,
      ...(config || {}),
    });
  }

  delete<R = T>(id: string | number): Promise<R> {
    return this.request<R>({
      method: 'DELETE',
      url: `${this.endpoint}/${id}`,
    });
  }

  paginate<R = T>(
    endpointCustom?: string,
    data?: { page: number; take: number }
  ): Promise<PaginateResult<R>> {
    return this.request<PaginateResult<R>>({
      method: 'POST',
      url: [this.endpoint, endpointCustom].filter(Boolean).join('/'),
      data,
      params: {
        ...(this.populateKeys?.length ? { populate: this.populateKeys } : {}),
      },
    });
  }

  getPaginate<R = T>(
    endpointCustom?: string,
    params?: Record<string, unknown>
  ): Promise<PaginateResult<R>> {
    return this.request<PaginateResult<R>>({
      method: 'GET',
      url: [this.endpoint, endpointCustom].filter(Boolean).join('/'),
      params: {
        ...params,
        ...(this.populateKeys?.length ? { populate: this.populateKeys } : {}),
      },
    });
  }

  protected request<R = T>(config: AxiosRequestConfig): Promise<R> {
    return axiosInstance.request<Result<R>, R>(config);
  }
}
