/* eslint-disable @ngrx/no-typed-global-store */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CardComponent } from '../components/card/card.component';
import { FormInputComponent } from '../components/form/form-input/form-input.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormButtonComponent } from '../components/form/form-button/form-button.component';
import { Store } from '@ngrx/store';
import { updateUser } from '../store/auth/auth.actions';
import { selectModelStatus, selectUser } from '../store/auth/auth.selector';
import { AppState } from '../store/app.store';
import {
  combineLatest,
  map,
  Observable,
  startWith,
  Subscription,
  switchAll,
} from 'rxjs';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    FormInputComponent,
    FormButtonComponent,
    NgxSkeletonLoaderModule,
    ReactiveFormsModule,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit, OnDestroy {
  /**
   *
   */
  user$ = this.store.select(selectUser);
  status$ = this.store.select(selectModelStatus);
  isUnchanged$!: Observable<boolean>;
  userSubscription!: Subscription;

  constructor(private store: Store<AppState>) {}
  infoForm = new FormGroup({
    // How to check if it is unique
    // Maybe auto generate from email
    displayName: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
    ]),
    firstName: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
    ]),
    lastName: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
    ]),
  });

  ngOnInit(): void {
    // Patch the form with user data and ensure it's in sync
    this.userSubscription = this.user$.subscribe((user) => {
      this.infoForm.patchValue({ ...user });
    });

    // Delay combineLatest until the form is fully initialized
    this.isUnchanged$ = this.user$.pipe(
      map((user) => {
        // After patching, return combineLatest of user and form changes
        return combineLatest([
          this.infoForm.valueChanges.pipe(startWith(this.infoForm.value)),
        ]).pipe(
          map(([formValues]) => {
            return JSON.stringify(user) === JSON.stringify(formValues);
          })
        );
      }),
      // Flatten the inner observable
      switchAll()
    );
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

  handleSubmit() {
    if (this.infoForm.invalid) return;
    const { displayName, firstName, lastName } = this.infoForm.value;
    if (!displayName || !firstName || !lastName) return;
    this.store.dispatch(updateUser({ displayName, firstName, lastName }));
  }
}
