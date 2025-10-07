import { APIClient } from '@/api/service-base';
import { UserInfo } from '@/types/entity';
import { SignInReq, SignInRes, SignUpReq } from './auth';

export class AuthService extends APIClient<UserInfo> {
  constructor() {
    super({
      endpoint: 'auth',
    });
  }

  me() {
    return this.get<UserInfo>({ endpoint: 'me' });
  }

  signin(data: SignInReq) {
    return this.post<SignInRes>(data, { endpoint: 'login' });
  }

  signup(data: SignUpReq) {
    return this.post<void>(data, { endpoint: 'register' });
  }
}

export const authService = new AuthService();
