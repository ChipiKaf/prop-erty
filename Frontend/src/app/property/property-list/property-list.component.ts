import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { IPropertyBase, PropertyBase } from '../../model/ipropertybase';
import { CommonModule } from '@angular/common';
import { PropertyCardComponent } from '../property-card/property-card.component';
import { FormsModule } from '@angular/forms';
import { FilterPipe } from '../../Pipes/filter.pipe';
import { SortPipe } from '../../Pipes/sort.pipe';
import { RouterModule } from '@angular/router';
import { HousingService } from '../../services/housing.service';

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

  constructor(private housingService: HousingService) {} // // private route: ActivatedRoute,

  ngOnInit(): void {
    this.properties = [
      new PropertyBase(
        1,
        1000,
        'The Penthouse',
        'Estate',
        'Modern',
        1000,
        2,
        1,
        'Pretoria',
        true,
        '1.jpg',
        `Experience unparalleled luxury with this exquisite penthouse in a prestigious Pretoria estate.
        This stunning residence offers modern sophistication and timeless charm, making it the perfect
        retreat for an elevated lifestyle. Nestled in the heart of Pretoria, the estate provides easy
        access to upscale shopping, fine dining, and reputable schools, all within a serene, secure environment.`
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
        '2.jpg',
        `Experience tranquility and modern living in this beautiful sanctuary home townhouse located in the vibrant city of Johannesburg.
        This residence combines contemporary design with a serene atmosphere, providing the perfect escape from the bustling city life.`
      ),
      new PropertyBase(
        3,
        2000,
        'The Condo',
        'Flat',
        'Antique',
        2000,
        3,
        2,
        'Johannesburg',
        false,
        '3.jpg',
        `Welcome to this stylish condo in the heart of Johannesburg,
        offering modern living in a prime urban setting. This well-appointed
        flat provides a perfect blend of comfort and convenience, ideal for city
        dwellers seeking a vibrant lifestyle. Located in a desirable neighborhood,
        the condo offers easy access to Johannesburg's top attractions, shopping centers,
        dining spots, and cultural landmarks. The building features secure access, ensuring
        a safe and peaceful living environment.`
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
        '4.jpg',
        `Discover refined living in this elegant townhouse located in the sought-after Craven Hills neighborhood of Durban.
        This residence offers a harmonious blend of contemporary design and comfort, making it an ideal home for those
        seeking both style and convenience.`
      ),
    ];
    localStorage.setItem('properties', JSON.stringify(this.properties));
    this.housingService.getAllCities().subscribe((data) => {
      console.log(data);
    });
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
