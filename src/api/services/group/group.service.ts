import { APIClient } from '@/api/service-base';
import { GroupEntity } from './group';

export class GroupService extends APIClient<GroupEntity> {
  constructor() {
    super({
      endpoint: 'groups',
    });
  }

  getList() {
    return this.getPaginate<GroupEntity>(undefined, {
      page: 1,
      take: 10,
    });
  }
}

export const groupService = new GroupService();
