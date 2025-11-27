import { EntityBase } from '@/api/entity-base';
import { UserInfo } from '@/types/entity';

export interface GroupEntity extends EntityBase {
  name: string;
  code: string;
  users: UserInfo;
  permissions: Permission[];
}

export enum Permission {
  ADD_USER = 'ADD_USER',
  UPDATE_USER = 'UPDATE_USER',
  DELETE_USER = 'DELETE_USER',
  ADD_GROUP = 'ADD_GROUP',
  UPDATE_GROUP = 'UPDATE_GROUP',
  DELETE_GROUP = 'DELETE_GROUP',
  ADD_DEPARTMENT = 'ADD_DEPARTMENT',
  UPDATE_DEPARTMENT = 'UPDATE_DEPARTMENT',
  DELETE_DEPARTMENT = 'DELETE_DEPARTMENT',
}
