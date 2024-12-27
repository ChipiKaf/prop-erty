import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Property } from '../../model/property';
import { Observable, of } from 'rxjs';
import { HousingService } from '../../services/housing.service';
import { catchError } from 'rxjs/operators';
import { RoutingService } from '../../services/routing.service';
import { GetPropertyModel } from '../../model/GetProperty';

@Injectable({
  providedIn: 'root',
})
export class PropertyDetailResolverService
  implements Resolve<GetPropertyModel>
{
  constructor(
    private router: RoutingService,
    private housingService: HousingService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<GetPropertyModel> {
    const propId = route.params['id'];
    return this.housingService.getProperty(+propId).pipe(
      catchError((_error) => {
        console.error(_error);
        this.router.navigate(['/']);
        const result: GetPropertyModel = {
          currentItem: new Property(),
          nextItem: new Property(),
          prevItem: new Property(),
        };
        return of(result);
      })
    );
  }
}
