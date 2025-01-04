import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { propertyReducer } from './store/property/property.reducer';
import { provideEffects } from '@ngrx/effects';
import { PropertyEffects } from './store/property/property.effects';
import { authReducer } from './store/auth/auth.reducer';
import { AuthEffects } from './store/auth/auth.effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { notificationReducer } from './store/notification/notification.reducer';
import { NotificationEffects } from './store/notification/notification.effects';
import { AppEffects } from './store/app.effects';
import { AuthInterceptor } from './services/interceptors/auth.interceptor';
import { CsrfInterceptor } from './services/interceptors/csrf.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withInterceptorsFromDi()),
    provideRouter(routes),
    provideStore({
      properties: propertyReducer,
      auth: authReducer,
      notification: notificationReducer,
    }),
    provideEffects(
      PropertyEffects,
      AuthEffects,
      NotificationEffects,
      AppEffects
    ),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: CsrfInterceptor, multi: true },
    provideStoreDevtools({
      maxAge: 25, // Retains last 25 states
      logOnly: false, // Enable log-only mode in production
    }),
  ],
};
