import { EntityBase } from '@/api/entity-base';
import { UserInfo } from '@/types/entity';

export interface GroupEntity extends EntityBase {
  name: string;
  code: string;
  users: UserInfo[];
}
