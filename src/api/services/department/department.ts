import { EntityBase } from '@/api/entity-base';
import { UserInfo } from '@/types/entity';

export interface DepartmentEntity extends EntityBase {
  name: string;
  code: string;
  path: string;
  manager?: UserInfo;
  deputy?: UserInfo;
  users?: UserInfo[];
  parent?: DepartmentEntity;
}
