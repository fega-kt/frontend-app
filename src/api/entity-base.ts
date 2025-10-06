import { UserInfo } from '@/types/entity';

export interface EntityBase {
  id: string;
  createdBy: UserInfo;
  modifiedBy: UserInfo;
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
