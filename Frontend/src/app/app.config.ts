import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { propertyReducer } from './store/property/property.reducer';
import { provideEffects } from '@ngrx/effects';
import { PropertyEffects } from './store/property/property.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withInterceptorsFromDi()),
    provideRouter(routes),
    provideStore({ properties: propertyReducer }),
    provideEffects(PropertyEffects),
  ],
};
