import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  loadUser,
  loadUserFailure,
  loadUserSuccessful,
  logInUser,
  logInUserFailure,
  logInUserSuccessful,
  signUpFailure,
  signUpSuccessful,
  signUpUser,
  updateUser,
  updateUserFailure,
  updateUserSuccessful,
} from './auth.actions';
import { catchError, delay, map, of, switchMap } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { RoutingService } from '../../services/routing.service';
import { GRACE_PERIOD } from '../../constants';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: RoutingService
  ) {}
  logIn$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(logInUser),
      delay(GRACE_PERIOD),
      // Side effects
      switchMap(({ email, password }) => {
        return this.authService.authUser({ email, password }).pipe(
          map(({ token }) => {
            localStorage.setItem('token', token);
            this.router.navigate(['/']);
            return logInUserSuccessful({ token });
          }),
          catchError((error) => {
            return of(logInUserFailure({ error }));
          })
        );
      })
    );
  });
  authSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(logInUserSuccessful, signUpSuccessful),
      map(({}) => {
        return loadUser();
      })
    );
  });
  signUp$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(signUpUser),
      delay(GRACE_PERIOD),
      // Side effects
      switchMap(({ email, password, confirmPassword }) => {
        return this.authService
          .registerUser({ email, password, confirmPassword })
          .pipe(
            map(({ token }) => {
              localStorage.setItem('token', token);
              this.router.navigate(['/']);
              return signUpSuccessful({ token });
            }),
            catchError((error) => of(signUpFailure({ error })))
          );
      })
    );
  });
  loadUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadUser),
      // Side effects
      switchMap(() => {
        return this.authService.getUser().pipe(
          delay(GRACE_PERIOD),
          map((user) => loadUserSuccessful(user)),
          catchError((error) => {
            this.router.navigate(['/login']);
            return of(loadUserFailure({ error }));
          })
        );
      })
    );
  });
  updateUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(updateUser),
      delay(GRACE_PERIOD),
      switchMap(({ displayName, firstName, lastName }) => {
        return this.authService
          .updateUser({
            displayName,
            firstName,
            lastName,
          })
          .pipe(
            map(() =>
              updateUserSuccessful({ displayName, firstName, lastName })
            ),
            catchError((err) => of(updateUserFailure(err)))
          );
      })
    );
  });
}
