import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept<T, S>(
    req: HttpRequest<T>,
    next: HttpHandler
  ): Observable<HttpEvent<S>> {
    const clonedRequest = req.clone({
      withCredentials: true,
    });
    return next.handle(clonedRequest);
  }
}
