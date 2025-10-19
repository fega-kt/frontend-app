import { APIClient } from '@/api/service-base';
import { DepartmentEntity } from './department';

export class DepartmentService extends APIClient<DepartmentEntity> {
  constructor() {
    super({
      endpoint: 'departments',
    });
  }

  getList() {
    return this.getPaginate<DepartmentEntity>(undefined, {
      page: 1,
      take: 10,
    });
  }
}

export const departmentService = new DepartmentService();
