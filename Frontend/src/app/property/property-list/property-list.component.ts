import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { IPropertyBase, PropertyBase } from '../../model/ipropertybase';
import { CommonModule } from '@angular/common';
import { PropertyCardComponent } from '../property-card/property-card.component';
import { FormsModule } from '@angular/forms';
import { FilterPipe } from '../../Pipes/filter.pipe';
import { SortPipe } from '../../Pipes/sort.pipe';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-property-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
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
        'The Penthouse',
        'Flat',
        'Modern',
        1000,
        2,
        1,
        'Pretoria',
        true,
        '1.jpg'
      ),
      new PropertyBase(
        2,
        2000,
        'Sanctuary home',
        'Townhouse',
        'Antique',
        2000,
        3,
        2,
        'Johannesburg',
        false,
        '2.jpg'
      ),
      new PropertyBase(
        3,
        2000,
        'The Condo',
        'Townhouse',
        'Antique',
        2000,
        3,
        2,
        'Johannesburg',
        false,
        '3.jpg'
      ),
      new PropertyBase(
        4,
        2000,
        'Craven hills',
        'Townhouse',
        'Antique',
        2000,
        3,
        2,
        'Durban',
        false,
        '4.jpg'
      ),
    ];
    localStorage.setItem('properties', JSON.stringify(this.properties));
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
