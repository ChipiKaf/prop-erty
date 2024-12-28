/* eslint-disable @ngrx/no-typed-global-store */
import { Component, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { combineLatest, map, Observable, of, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.store';
import { selectAllProperties } from '../../store/property/property.selector';
import { IPropertyBase } from '../../model/ipropertybase';
import { loadProperty } from '../../store/property/property.actions';

@Component({
  selector: 'app-property-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './property-details.component.html',
  styleUrl: './property-details.component.scss',
})
export class PropertyDetailsComponent implements OnInit, AfterViewInit {
  public propertyId: number = 0;
  public mainPhotoUrl: string | null = null;
  private properties$ = this.store.select(selectAllProperties);
  prevProperty$: Observable<IPropertyBase | null> | null = null;
  property$: Observable<IPropertyBase | null> | null = null;
  nextProperty$: Observable<IPropertyBase | null> | null = null;
  combinedProperties$: Observable<{
    current: IPropertyBase | null;
    next: IPropertyBase | null;
    prev: IPropertyBase | null;
  } | null> | null = null;

  prevProperty: IPropertyBase | null = null;
  nextProperty: IPropertyBase | null = null;
  movingImage: string | undefined = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private el: ElementRef<HTMLDivElement>,
    private store: Store<AppState>
  ) {}

  ngAfterViewInit(): void {
    const iconContainer = this.el.nativeElement.querySelector('.three-d-icon');
    if (!iconContainer) return;
    const text = iconContainer.querySelector('.text-inner');
    const icon = iconContainer.querySelector('i');
    gsap.set(icon, { xPercent: 100 });
    iconContainer.addEventListener('mouseenter', () => {
      gsap.to(text, { x: 0 });
      gsap.to(icon, { xPercent: 0 });
    });
    iconContainer.addEventListener('mouseleave', () => {
      gsap.to(text, { x: -100 });
      gsap.to(icon, { xPercent: 100 });
    });
  }

  ngOnInit() {
    this.propertyId = +this.route.snapshot.params['id'];
    this.getCurrentProperty();
    this.getNextProperty();
    this.getPreviousProperty();

    this.combinedProperties$ = combineLatest({
      current: this.property$ || of(null),
      next: this.nextProperty$ || of(null),
      prev: this.prevProperty$ || of(null),
    });
  }
  private getPreviousProperty() {
    this.prevProperty$ = this.properties$.pipe(
      switchMap((properties) => {
        if (properties && properties.length > 0) {
          const prevProperty = properties
            .filter((p) => p.id < this.propertyId) // Find properties with ID > current ID
            .sort((a, b) => a.id - b.id)[0]; // Sort ascending and get the first one
          return of(prevProperty || null);
        } else {
          // Re-observe the store after dispatching loadProperty
          return this.store.select(selectAllProperties).pipe(
            map((updatedProperties) => {
              const prevProperty = updatedProperties
                .filter((p) => p.id < this.propertyId)
                .sort((a, b) => a.id - b.id)[0];
              return prevProperty || null;
            })
          );
        }
      })
    );
  }

  private getCurrentProperty() {
    this.property$ = this.properties$.pipe(
      switchMap((properties) => {
        if (properties && properties.length > 0) {
          const property = properties.find((p) => p.id === this.propertyId);
          if (!property) return of(null);
          this.movingImage = property.image;
          return of(property);
        } else {
          // Dispatch action to load the single property
          this.store.dispatch(loadProperty({ id: this.propertyId }));
          // Re-observe the store to wait for the property to be loaded
          return this.store.select(selectAllProperties).pipe(
            map((updatedProperties) => {
              const currentProperty = updatedProperties.find(
                (p) => p.id === this.propertyId
              );
              if (!currentProperty) return null;
              this.movingImage = currentProperty.image;
              return (
                updatedProperties.find((p) => p.id === this.propertyId) || null
              );
            })
          );
        }
      })
    );
  }

  private getNextProperty() {
    // Fetch the next property
    this.nextProperty$ = this.properties$.pipe(
      switchMap((properties) => {
        if (properties && properties.length > 0) {
          const nextProperty = properties
            .filter((p) => p.id > this.propertyId) // Find properties with ID > current ID
            .sort((a, b) => a.id - b.id)[0]; // Sort ascending and get the first one
          return of(nextProperty || null);
        } else {
          // Re-observe the store after dispatching loadProperty
          return this.store.select(selectAllProperties).pipe(
            map((updatedProperties) => {
              const nextProperty = updatedProperties
                .filter((p) => p.id > this.propertyId)
                .sort((a, b) => a.id - b.id)[0];
              return nextProperty || null;
            })
          );
        }
      })
    );
  }

  navigateTo3D() {
    this.router.navigate([`/property-view-3d/${this.propertyId}`]);
  }

  changePrimaryPhoto(mainPhotoUrl: string) {
    this.mainPhotoUrl = mainPhotoUrl;
  }
}
