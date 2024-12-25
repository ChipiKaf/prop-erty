export interface UserForRegister {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface UserForLogin {
  email: string;
  password: string;
  token?: string;
}
