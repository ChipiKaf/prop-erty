// app.effects.ts
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { initializeSession } from './app.actions';
import { loadUser } from './auth/auth.actions';
import { loadProperties } from './property/property.actions';
import { map } from 'rxjs/operators';

@Injectable()
export class AppEffects {
  constructor(private actions$: Actions) {}

  // Effect to load the user
  loadUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(initializeSession),
      map(() => loadUser())
    );
  });

  // Effect to load properties
  loadProperties$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(initializeSession),
      map(() => loadProperties())
    );
  });
}
