import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HousingService } from '../../services/housing.service';
import { HttpErrorResponse } from '@angular/common/http';
import { RoutingService } from '../../services/routing.service';
import { catchError, of, tap } from 'rxjs';

@Component({
  selector: 'app-property-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './property-list.component.html',
  styleUrl: './property-list.component.scss',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class PropertyListComponent {
  SellRent = 1;
  properties$ = this.housingService.getAllProperties().pipe(
    tap(() => console.log('Get all properties')),
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401) {
        this.router.navigate(['/login']);
      }
      console.error(err.statusText);
      return of([]);
    })
  );

  constructor(
    private housingService: HousingService,
    private router: RoutingService
  ) {} // // private route: ActivatedRoute,
}
