import { APIClient } from '@/api/service-base';
import { GroupEntity } from './group.entity';

export class GroupService extends APIClient<GroupEntity> {
  constructor() {
    super({
      endpoint: 'groups',
    });
  }

  getList(data: { page: number; take: number }) {
    return this.getPaginate<GroupEntity>(undefined, data);
  }
}

export const groupService = new GroupService();
