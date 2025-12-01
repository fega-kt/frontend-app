import { APIClient } from '@/api/service-base';
import { UserInfo } from '@/types/entity';
import { UserItemList } from './user';

export class UserService extends APIClient<UserInfo> {
  constructor() {
    super({
      endpoint: 'users',
    });
  }

  getList(data: { page: number; take: number }) {
    return this.getPaginate<UserItemList>(undefined, data);
  }

  updateUser(id: string, data: unknown, file?: File) {
    const formData = new FormData();
    if (file) formData.append('avatar', file);
    return this.put(id, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
}

export const userService = new UserService();
