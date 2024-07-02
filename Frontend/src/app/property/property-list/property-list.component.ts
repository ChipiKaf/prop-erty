import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
// import { HousingService } from '../../services/housing.service';
// import { ActivatedRoute } from '@angular/router';
import { IPropertyBase, PropertyBase } from '../../model/ipropertybase';
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
  properties: IPropertyBase[] = [];
  Today = new Date();
  City = '';
  SearchCity = '';
  SortbyParam = '';
  SortDirection = 'asc';

  constructor() {} // private housingService: HousingService // private route: ActivatedRoute,

  ngOnInit(): void {
    this.properties = [
      new PropertyBase(
        1,
        1000,
        'Home',
        'Flat',
        'Modern',
        1000,
        2,
        1,
        'Pretoria',
        true,
        'flat2.webp'
      ),
      new PropertyBase(
        2,
        2000,
        'House',
        'Townhouse',
        'Antique',
        2000,
        3,
        2,
        'Johannesburg',
        false,
        'house2.webp'
      ),
    ];
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
