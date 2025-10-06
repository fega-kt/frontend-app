import { APIClient } from '@/api/service-base';
import { UserInfo } from '@/types/entity';
import { UserItemList } from './user';

export class UserService extends APIClient<UserInfo> {
  constructor() {
    super({
      endpoint: 'users',
    });
  }

  getList() {
    return this.getPaginate<UserItemList>(undefined, {
      page: 1,
      take: 10,
    });
  }
}

export const userService = new UserService();
