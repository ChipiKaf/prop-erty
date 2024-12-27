import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  loadProperties,
  loadPropertiesFailure,
  loadPropertiesSuccess,
  loadProperty,
  loadPropertySuccess,
} from './property.actions';
import { catchError, map, of, switchMap } from 'rxjs';
import { HousingService } from '../../services/housing.service';
import { RoutingService } from '../../services/routing.service';
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
      ofType(loadProperties),
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
}
