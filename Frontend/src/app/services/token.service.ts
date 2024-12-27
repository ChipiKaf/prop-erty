import { Injectable } from '@angular/core';
import { RoutingService } from './routing.service';
import { HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class TokenService {
  constructor(private router: RoutingService) {}

  private getToken() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      throw new Error('No token');
    }
    return token;
  }

  hasToken() {
    return !!localStorage.getItem('token');
  }

  getAuthHeader(): HttpHeaders {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return headers;
  }
}
