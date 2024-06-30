import { Component } from '@angular/core';

@Component({
  selector: 'app-property-card',
  standalone: true,
  imports: [],
  templateUrl: './property-card.component.html',
  styleUrl: './property-card.component.scss',
})
export class PropertyCardComponent {
  title: string = 'Property works';
  Property: any = {
    id: 1,
    name: 'Birla house',
    type: 'House',
    price: 12000,
  };
  constructor() {}
}
