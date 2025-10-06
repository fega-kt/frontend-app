import { EntityBase } from '@/api/entity-base';
import { UserInfo } from '@/types/entity';

export type UserItemList = EntityBase &
  Pick<UserInfo, 'role' | 'email' | 'firstName' | 'lastName' | 'avatar'>;
