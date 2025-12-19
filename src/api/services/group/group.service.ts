import { APIClient } from '@/api/service-base';
import { GroupEntity } from './group.entity';

export interface IUpsertGroup extends Pick<GroupEntity, 'code' | 'name'> {
  permissions?: {
    id: string;
    name: string;
  }[];
}

export class GroupService extends APIClient<GroupEntity> {
  constructor() {
    super({
      endpoint: 'groups',
      populateKeys: ['permissions', 'users'],
    });
  }

  getList(data: { page: number; take: number }) {
    return this.getPaginate<GroupEntity>(undefined, data);
  }

  update(id: string, data: IUpsertGroup) {
    return this.put(id, data);
  }

  add(data: IUpsertGroup) {
    return this.post(data);
  }
}

export const groupService = new GroupService();
