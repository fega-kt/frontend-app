import { BaseEntity } from '@/api/entity-base';
import { UserInfo } from '@/types/entity';

export type UserItemList = BaseEntity &
  Pick<UserInfo, 'role' | 'email' | 'firstName' | 'lastName' | 'avatar'>;
