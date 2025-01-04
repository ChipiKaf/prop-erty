import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  isAuthed,
  isNotAuthed,
  checkAuth,
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
  userLikeProperty,
  userLikePropertyFailure,
  userLogout,
  userUnlikeProperty,
  userUnlikePropertyFailure,
  userLogoutSuccess,
  userLogoutFailure,
} from './auth.actions';
import { catchError, delay, map, of, switchMap } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { RoutingService } from '../../services/routing.service';
import { GRACE_PERIOD } from '../../constants';
import { likeProperty, unlikeProperty } from '../property/property.actions';
import {
  showError,
  showNeutral,
  showSuccess,
} from '../notification/notification.action';
import { loadStartup } from '../app.actions';

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
          map(() => {
            this.router.navigate(['/']);
            return logInUserSuccessful();
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
      ofType(logInUserSuccessful, signUpSuccessful, loadStartup),
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
            map(() => {
              this.router.navigate(['/']);
              return signUpSuccessful();
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
  loadUserSuccessful$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadUserSuccessful),
      map(() => showSuccess({ message: 'Log in successful' }))
    );
  });
  updateUserSuccessful$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(updateUserSuccessful),
      map(() => showSuccess({ message: 'Updated user profile' }))
    );
  });
  loadUserFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadUserFailure, logInUserFailure),
      map(() => showError({ message: 'Failed to log in' }))
    );
  });
  updateUserFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(updateUserFailure),
      map(() => showError({ message: 'Failed to update user' }))
    );
  });
  signUpFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(signUpFailure),
      map(() => showError({ message: 'Failed to register user' }))
    );
  });
  updateUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(updateUser),
      delay(GRACE_PERIOD),
      switchMap(({ displayName, firstName, lastName, likes }) => {
        return this.authService
          .updateUser({
            displayName,
            firstName,
            lastName,
          })
          .pipe(
            map(() =>
              updateUserSuccessful({ displayName, firstName, lastName, likes })
            ),
            catchError((err) => of(updateUserFailure(err)))
          );
      })
    );
  });
  userLikeProperty$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(userLikeProperty),
      map(({ propertyId }) => {
        return likeProperty({ propertyId });
      })
    );
  });
  userLikePropertyFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(userLikePropertyFailure, userUnlikePropertyFailure),
      map(() => {
        return showError({ message: 'Oops... Something went wrong' });
      })
    );
  });
  userUnlikeProperty$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(userUnlikeProperty),
      map(({ propertyId }) => {
        return unlikeProperty({ propertyId });
      })
    );
  });
  userLogout$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(userLogout),
      switchMap(() =>
        this.authService.logout().pipe(
          map(() => userLogoutSuccess()),
          catchError(() => of(userLogoutFailure()))
        )
      )
    );
  });

  userLogoutSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(userLogoutSuccess),
      map(() => {
        this.router.navigate(['/login']);
        return showNeutral({ message: 'Goodbye!' });
      })
    );
  });

  userLogoutFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(userLogoutFailure),
      map(() => {
        console.log('In logout failuer');
        return showError({ message: 'Oops... Something went wrong' });
      })
    );
  });

  checkAuth$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(checkAuth),
      switchMap(() =>
        this.authService.checkAuth().pipe(
          map(({ isAuthenticated }) => {
            if (isAuthenticated) return isAuthed();
            else return isNotAuthed();
          }), // Load Users and Properties
          catchError(() => {
            this.router.navigate(['/login']);
            return of(isNotAuthed());
          })
        )
      )
    );
  });

  isAuthed$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(isAuthed),
      map(() => loadUser())
    );
  });
}
