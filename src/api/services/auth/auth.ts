import { UserInfo, UserToken } from '@/types/entity';

export type SignInRes = UserToken & { user: UserInfo };

export interface SignInReq {
  email: string;
  password: string;
}

export interface SignUpReq {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}
