// app.effects.ts
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { initializeSession } from './app.actions';
import { checkAuth } from './auth/auth.actions';
import { map, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AppEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService
  ) {}

  // Effect to fetch antiforgery token
  loadAntiForgeryToken$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(initializeSession),
      switchMap(() =>
        this.authService.getCsrfToken().pipe(map(() => checkAuth()))
      )
    );
  });
}
