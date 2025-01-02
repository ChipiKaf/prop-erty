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
import { selectUser } from '../../store/auth/auth.selector';
import { combineLatest, Observable } from 'rxjs';
import { IPropertyBase } from '../../model/ipropertybase';
import { UserModel } from '../../model/user';
import { Status } from '../../model/store';
import { Like } from '../../model/like';

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
  user$ = this.store.select(selectUser);
  allImagesLoaded = false; // Track if all images are loaded
  data$: Observable<{
    properties: IPropertyBase[] | null;
    user: UserModel | null;
    fetchStatus: Status | null;
  }> | null = null;
  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.store.dispatch(loadProperties());
    this.data$ = combineLatest({
      properties: this.properties$,
      user: this.user$,
      fetchStatus: this.fetchStatus$,
    });
  }

  findLike(likes: Like[], propertyId: number): boolean {
    return !!likes.find((like) => like.propertyId === propertyId);
  }

  trackByPropertyId(index: number, property: IPropertyBase): number {
    return property.id;
  }
}
