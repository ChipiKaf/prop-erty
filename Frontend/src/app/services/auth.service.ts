import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserForRegister, UserForLogin, UserModel } from '../model/user';
import { environment } from '../../environments/environment';
import { TokenService } from './token.service';
import { Observable } from 'rxjs';

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
    return this.http.get<UserModel>(`${this.baseUrl}/account`);
  }

  logout<T>(): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/account/logout`, {});
  }

  checkAuth() {
    return this.http.get<{ isAuthenticated: boolean; user?: string }>(
      `${this.baseUrl}/account/check-auth`
    );
  }

  getCsrfToken<T>(): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/account/antiforgery/token`);
  }

  updateUser(user: {
    displayName: string | null;
    firstName: string | null;
    lastName: string | null;
  }) {
    return this.http.patch<void>(`${this.baseUrl}/account`, { ...user });
  }
}
