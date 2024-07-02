import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { HousingService } from '../../services/housing.service';
import { ActivatedRoute } from '@angular/router';
import { IPropertyBase } from '../../model/ipropertybase';
import { CommonModule } from '@angular/common';
import { PropertyCardComponent } from '../property-card/property-card.component';
import { FormsModule } from '@angular/forms';
import { FilterPipe } from '../../Pipes/filter.pipe';
import { SortPipe } from '../../Pipes/sort.pipe';

@Component({
  selector: 'app-property-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PropertyCardComponent,
    FilterPipe,
    SortPipe,
  ],
  templateUrl: './property-list.component.html',
  styleUrl: './property-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertyListComponent implements OnInit {
  SellRent = 1;
  properties: IPropertyBase[] | null = null;
  Today = new Date();
  City = '';
  SearchCity = '';
  SortbyParam = '';
  SortDirection = 'asc';

  constructor(
    private route: ActivatedRoute,
    private housingService: HousingService
  ) {}

  ngOnInit(): void {

  }

  onCityFilter() {
    this.SearchCity = this.City;
  }

  onCityFilterClear() {
    this.SearchCity = '';
    this.City = '';
  }

  onSortDirection() {
    if (this.SortDirection === 'desc') {
      this.SortDirection = 'asc';
    } else {
      this.SortDirection = 'desc';
    }
  }
}
