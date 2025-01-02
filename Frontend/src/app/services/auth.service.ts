import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserForRegister, UserForLogin, UserModel } from '../model/user';
import { environment } from '../../environments/environment';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl = environment.baseUrl;
  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) {}

  authUser(user: UserForLogin) {
    return this.http.post<{ token: string; message: string }>(
      this.baseUrl + '/account/login',
      user
    );
  }

  registerUser(user: UserForRegister) {
    return this.http.post<{ token: string; message: string }>(
      this.baseUrl + '/account/register',
      user
    );
  }

  getUser() {
    const headers = this.tokenService.getAuthHeader();
    return this.http.get<UserModel>(`${this.baseUrl}/account`, {
      headers,
    });
  }

  updateUser(user: {
    displayName: string | null;
    firstName: string | null;
    lastName: string | null;
  }) {
    const headers = this.tokenService.getAuthHeader();
    return this.http.patch<void>(
      `${this.baseUrl}/account`,
      { ...user },
      { headers }
    );
  }
}
