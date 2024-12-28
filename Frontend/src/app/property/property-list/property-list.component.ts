/* eslint-disable @ngrx/no-typed-global-store */
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import {
  selectAllProperties,
  selectPropertiesFetchStatus,
} from '../../store/property/property.selector';
import { AppState } from '../../store/app.store';
import { loadProperties } from '../../store/property/property.actions';
import { PropertyItemComponent } from '../property-item/property-item.component';

@Component({
  selector: 'app-property-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NgxSkeletonLoaderModule,
    PropertyItemComponent,
  ],
  templateUrl: './property-list.component.html',
  styleUrl: './property-list.component.scss',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class PropertyListComponent implements OnInit {
  SellRent = 1;
  properties$ = this.store.select(selectAllProperties);
  fetchStatus$ = this.store.select(selectPropertiesFetchStatus);
  allImagesLoaded = false; // Track if all images are loaded

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.store.dispatch(loadProperties());
  }
}
