import { Like } from './like';

export interface UserForRegister {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface UserForLogin {
  email: string;
  password: string;
}

export interface UserModel {
  displayName: string | null;
  firstName: string | null;
  lastName: string | null;
  likes: Like[] | null;
}
