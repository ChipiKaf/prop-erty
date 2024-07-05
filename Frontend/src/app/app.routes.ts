import { Routes } from '@angular/router';
import { PropertyListComponent } from './property/property-list/property-list.component';
import { PropertyDetailsComponent } from './property/property-details/property-details.component';
import { PropertyDetailResolverService } from './property/property-details/property-details-resolver.service';

export const routes: Routes = [
  {
    path: '',
    component: PropertyListComponent,
  },
  {
    path: 'property-detail/:id',
    component: PropertyDetailsComponent,
    resolve: { prp: PropertyDetailResolverService },
  },
];
