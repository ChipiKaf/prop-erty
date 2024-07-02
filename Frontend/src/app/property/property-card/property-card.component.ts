import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IPropertyBase } from '../../model/ipropertybase';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-property-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './property-card.component.html',
  styleUrl: './property-card.component.scss',
})
export class PropertyCardComponent {
  @Input() property: IPropertyBase | null;
  @Input() hideIcons: boolean = true;
  constructor() {
    this.property = null;
  }
}
