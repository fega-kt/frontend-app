import { EntityBase } from '@/api/entity-base';
import { UserInfo } from '@/types/entity';

export interface Department extends EntityBase {
  name: string;
  code: string;
  path: string;
  users?: UserInfo[];
}
