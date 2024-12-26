import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Property } from '../../model/property';
import { Observable, of } from 'rxjs';
import { HousingService } from '../../services/housing.service';
import { catchError } from 'rxjs/operators';
import { RoutingService } from '../../services/routing.service';

@Injectable({
  providedIn: 'root',
})
export class PropertyDetailResolverService
  implements
    Resolve<{ currentItem: Property | null; nextItem: Property | null }>
{
  constructor(
    private router: RoutingService,
    private housingService: HousingService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot
  ): Observable<{ currentItem: Property | null; nextItem: Property | null }> {
    const propId = route.params['id'];
    return this.housingService.getProperty(+propId).pipe(
      catchError((_error) => {
        console.error(_error);
        this.router.navigate(['/']);
        return of({ currentItem: new Property(), nextItem: new Property() }); // Return an empty Property instead of null
      })
    );
  }
}
