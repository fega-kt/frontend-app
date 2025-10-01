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

// Request interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { accessToken } = userStore.getState().userToken;
    config.headers.Authorization = accessToken ? `Bearer ${accessToken}` : '';
    return config;
  },
  (error: Error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  <T>(res: AxiosResponse<Result<T>>) => {
    if (!res.data) throw new Error(t('sys.api.apiRequestFailed'));
    const { status, data, message } = res.data;
    if (status === ResultStatus.SUCCESS) {
      return data;
    }
    throw new Error(message || t('sys.api.apiRequestFailed'));
  },
  (error: AxiosError<Result<unknown>>) => {
    const { response, message } = error || {};
    const errMsg =
      response?.data?.message || message || t('sys.api.errorMessage');
    toast.error(errMsg, { position: 'top-center' });
    if (response?.status === 401) {
      userStore.getState().actions.clearUserInfoAndToken();
    }
    return Promise.reject(error);
  }
);

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
    console.log('data', data, options);
    return this.request<R>({
      method: 'POST',
      url: this.endpoint,
      data,
    });
  }

  put<R = T>(id: string | number, data: Partial<T>): Promise<R> {
    return this.request<R>({
      method: 'PUT',
      url: `${this.endpoint}/${id}`,
      data,
    });
  }

  delete<R = T>(id: string | number): Promise<R> {
    return this.request<R>({
      method: 'DELETE',
      url: `${this.endpoint}/${id}`,
    });
  }

  paginate<R = T>(
    enpointCustom?: string,
    data?: { page: number; take: number }
  ): Promise<PaginateResult<R>> {
    return this.request<PaginateResult<R>>({
      method: 'POST',
      url: [this.endpoint, enpointCustom].filter(Boolean).join('/'),
      data: data,
      params: {
        ...(this.populateKeys?.length ? { populate: this.populateKeys } : {}),
      },
    });
  }

  getPaginate<R = T>(
    enpointCustom?: string,
    params?: Record<string, unknown>
  ): Promise<PaginateResult<R>> {
    return this.request<PaginateResult<R>>({
      method: 'GET',
      url: [this.endpoint, enpointCustom].filter(Boolean).join('/'),
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
