import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  likeProperty,
  likePropertyFailure,
  likePropertySuccess,
  loadProperties,
  loadPropertiesFailure,
  loadPropertiesSuccess,
  loadProperty,
  loadPropertySuccess,
  unlikeProperty,
  unlikePropertyFailure,
  unlikePropertySuccess,
} from './property.actions';
import { catchError, map, of, switchMap } from 'rxjs';
import { HousingService } from '../../services/housing.service';
import { RoutingService } from '../../services/routing.service';
import {
  userLikePropertyFailure,
  userUnlikePropertyFailure,
} from '../auth/auth.actions';
import { showError } from '../notification/notification.action';
import { loadStartup } from '../app.actions';
@Injectable()
export class PropertyEffects {
  constructor(
    private actions$: Actions,
    private housingService: HousingService,
    private router: RoutingService
  ) {}

  loadProperties$ = createEffect(() => {
    return this.actions$.pipe(
      // Listen to only loadProperties action
      ofType(loadProperties, loadStartup),
      switchMap(() =>
        this.housingService.getAllProperties().pipe(
          map((properties) => {
            return loadPropertiesSuccess({ properties });
          }),
          catchError((error) => {
            this.router.navigate(['/login']);
            return of(loadPropertiesFailure({ error }));
          })
        )
      )
    );
  });

  loadProperty$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadProperty),
      switchMap(({ id }) => {
        return this.housingService.getProperty(id).pipe(
          map((property) => {
            return loadPropertySuccess(property);
          }),
          catchError((err) => {
            return of(loadPropertiesFailure({ error: err.message }));
          })
        );
      })
    );
  });

  loadPropertiesFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadPropertiesFailure),
      map(() => {
        console.log('Load poperties failed');
        return showError({ message: 'Oops... Something went wrong' });
      })
    );
  });

  likeProperty$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(likeProperty),
      switchMap(({ propertyId }) => {
        return this.housingService.likeProperty(propertyId).pipe(
          map(() => likePropertySuccess({ propertyId })),
          catchError(() => {
            return of(likePropertyFailure({ propertyId }));
          })
        );
      })
    );
  });
  likePropertyFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(likePropertyFailure),
      map(({ propertyId }) => {
        return userLikePropertyFailure({ propertyId });
      })
    );
  });

  unlikeProperty$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(unlikeProperty),
      switchMap(({ propertyId }) => {
        return this.housingService.unlikeProperty(propertyId).pipe(
          map(() => unlikePropertySuccess({ propertyId })),
          catchError(() => {
            return of(unlikePropertyFailure({ propertyId }));
          })
        );
      })
    );
  });
  unlikePropertyFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(unlikePropertyFailure),
      map(({ propertyId }) => {
        return userUnlikePropertyFailure({ propertyId });
      })
    );
  });
}
