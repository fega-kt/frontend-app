import { APIClient } from '@/api/service-base';
import { DepartmentEntity } from './department.entity';

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

  update(id: string, data: Partial<DepartmentEntity>) {
    return this.put(id, this.normalized(data, ['manager', 'deputy', 'parent']));
  }

  add(data: Partial<DepartmentEntity>) {
    return this.post(this.normalized(data, ['manager', 'deputy', 'parent']));
  }

  dataTree() {
    return this.get<DepartmentEntity[]>({ endpoint: 'tree' });
  }
}

export const departmentService = new DepartmentService();
