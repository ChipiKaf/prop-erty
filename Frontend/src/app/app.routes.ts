import { Routes } from '@angular/router';
import { PropertyListComponent } from './property/property-list/property-list.component';
import { PropertyDetailsComponent } from './property/property-details/property-details.component';
import { PropertyDetailResolverService } from './property/property-details/property-details-resolver.service';
import { LoginComponent } from './authentication/login/login.component';
import { ThreeDViewComponent } from './three-d-view/three-d-view.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    component: PropertyListComponent,
  },
  {
    path: 'property-detail/:id',
    component: PropertyDetailsComponent,
    resolve: { prp: PropertyDetailResolverService },
  },
  {
    path: 'property-view-3d/:id',
    component: ThreeDViewComponent,
  },
];
