export interface UserForRegister {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface UserForLogin {
  userName: string;
  password: string;
  token: string;
}
