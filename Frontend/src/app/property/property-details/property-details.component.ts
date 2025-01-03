/* eslint-disable @ngrx/no-typed-global-store */
import {
  Component,
  ElementRef,
  OnInit,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import {
  combineLatest,
  map,
  Observable,
  of,
  Subscription,
  switchMap,
} from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.store';
import { selectAllProperties } from '../../store/property/property.selector';
import { IPropertyBase } from '../../model/ipropertybase';
import { loadProperty } from '../../store/property/property.actions';
import { LikeButtonComponent } from '../../components/buttons/like-button/like-button.component';
import { Like } from '../../model/like';
import { UserModel } from '../../model/user';
import { selectUser } from '../../store/auth/auth.selector';
import {
  userLikeProperty,
  userUnlikeProperty,
} from '../../store/auth/auth.actions';

@Component({
  selector: 'app-property-details',
  standalone: true,
  imports: [CommonModule, LikeButtonComponent],
  templateUrl: './property-details.component.html',
  styleUrl: './property-details.component.scss',
})
export class PropertyDetailsComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  public propertyId: number = 0;
  public mainPhotoUrl: string | null = null;
  private properties$ = this.store.select(selectAllProperties);
  prevProperty$: Observable<IPropertyBase | null> | null = null;
  user$: Observable<UserModel> = this.store.select(selectUser);
  property$: Observable<IPropertyBase | null> | null = null;
  nextProperty$: Observable<IPropertyBase | null> | null = null;
  combinedProperties$: Observable<{
    current: IPropertyBase | null;
    next: IPropertyBase | null;
    prev: IPropertyBase | null;
    user: UserModel | null;
  } | null> | null = null;

  prevProperty: IPropertyBase | null = null;
  nextProperty: IPropertyBase | null = null;
  movingImage: string | undefined = '';
  private routeSub!: Subscription;

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
    this.routeSub = this.route.paramMap.subscribe((params) => {
      const idParam = params.get('id');
      if (idParam) {
        this.propertyId = +idParam;
        this.loadPropertyData();
      }
    });
    // this.propertyId = +this.route.snapshot.params['id'];
    // this.getCurrentProperty();
    // this.getNextProperty();
    // this.getPreviousProperty();

    // this.combinedProperties$ = combineLatest({
    //   current: this.property$ || of(null),
    //   next: this.nextProperty$ || of(null),
    //   prev: this.prevProperty$ || of(null),
    //   user: this.user$ || of(null),
    // });
  }
  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
  }
  private loadPropertyData() {
    this.getCurrentProperty();
    this.getNextProperty();
    this.getPreviousProperty();

    this.combinedProperties$ = combineLatest({
      current: this.property$ || of(null),
      next: this.nextProperty$ || of(null),
      prev: this.prevProperty$ || of(null),
      user: this.user$,
    });
  }
  public findLike(likes: Like[], propertyId: number): boolean {
    return !!likes.find((like) => like.propertyId === propertyId);
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

  public navigateTo3D() {
    this.router.navigate([`/property-view-3d/${this.propertyId}`]);
  }

  public goTo(id: number) {
    this.router.navigate([`/property-detail/${id}`]);
  }

  public changePrimaryPhoto(mainPhotoUrl: string) {
    this.mainPhotoUrl = mainPhotoUrl;
  }
  public handleIconClick(ev: MouseEvent, propertyId: number, isLiked: boolean) {
    ev.preventDefault();
    ev.stopPropagation();
    if (!isLiked) this.store.dispatch(userLikeProperty({ propertyId }));
    else this.store.dispatch(userUnlikeProperty({ propertyId }));
  }
}
