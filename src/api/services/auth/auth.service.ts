import { APIClient } from '@/api/service-base';
import { UserInfo } from '@/types/entity';

export class AuthService extends APIClient<UserInfo> {
  constructor() {
    super({
      endpoint: 'auth',
    });
  }

  me() {
    return this.get<UserInfo>({ endpoint: 'me' });
  }
}

export const authService = new AuthService();
