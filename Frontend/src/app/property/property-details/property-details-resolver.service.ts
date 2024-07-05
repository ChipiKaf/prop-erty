import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Property } from '../../model/property';
import { Observable } from 'rxjs';
import { HousingService } from '../../services/housing.service';
// import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PropertyDetailResolverService implements Resolve<Property> {
  constructor(
    private router: Router,
    private housingService: HousingService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Property> {
    const propId = route.params['id'];
    return this.housingService.getProperty(+propId);

    // .pipe(
    //   catchError((_error) => {
    //     console.error(_error);
    //     this.router.navigate(['/']);
    //     return of(new Property()); // Return an empty Property instead of null
    //   })
    // );
  }
}
