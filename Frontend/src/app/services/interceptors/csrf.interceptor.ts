import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class CsrfInterceptor implements HttpInterceptor {
  intercept<T, S>(
    req: HttpRequest<T>,
    next: HttpHandler
  ): Observable<HttpEvent<S>> {
    const csrfToken = this.getCookie('XSRF-TOKEN');
    if (csrfToken) {
      const cloned = req.clone({
        headers: req.headers.set('X-XSRF-TOKEN', csrfToken),
      });
      return next.handle(cloned);
    }
    return next.handle(req);
  }

  private getCookie(name: string): string | null {
    const matches = document.cookie.match(
      new RegExp(
        `(?:^|; )${name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1')}=([^;]*)`
      )
    );
    return matches ? decodeURIComponent(matches[1]) : null;
  }
}
