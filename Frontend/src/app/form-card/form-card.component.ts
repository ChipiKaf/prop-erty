/* eslint-disable @ngrx/no-typed-global-store */
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  passwordMatchValidator,
  passwordValidator,
} from '../helpers/validators/passwordValidators';
import { CardComponent } from '../components/card/card.component';
import { FormInputComponent } from '../components/form/form-input/form-input.component';
import { FormButtonComponent } from '../components/form/form-button/form-button.component';
import { Store } from '@ngrx/store';
import { selectAuthenticationStatus } from '../store/auth/auth.selector';
import { AppState } from '../store/app.store';
import { logInUser, signUpUser } from '../store/auth/auth.actions';

@Component({
  selector: 'app-form-card',
  standalone: true,
  imports: [
    CommonModule,
    FormInputComponent,
    FormsModule,
    ReactiveFormsModule,
    CardComponent,
    FormButtonComponent,
  ],
  templateUrl: './form-card.component.html',
  styleUrl: './form-card.component.scss',
})
export class FormCardComponent {
  isSignup: boolean = false;
  authForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl(''),
  });
  isLoading$ = this.store.select(selectAuthenticationStatus);

  constructor(private store: Store<AppState>) {}

  toggleAuthPage() {
    this.isSignup = !this.isSignup;
    const confirmPassword = this.authForm.get('confirmPassword');
    const password = this.authForm.get('password');
    if (this.isSignup) {
      confirmPassword?.setValidators([Validators.required]);
      password?.setValidators([Validators.required, passwordValidator()]);
      this.authForm.setValidators([passwordMatchValidator()]);
    } else {
      this.authForm.clearValidators();
      confirmPassword?.clearValidators();
      password?.setValidators([Validators.required]);
    }
    confirmPassword?.updateValueAndValidity();
    password?.updateValueAndValidity();
  }

  handleSubmit() {
    if (!this.authForm.valid) return;
    const { email, password, confirmPassword } = this.authForm.value;
    if (!email || !password) return;

    if (this.isSignup) {
      if (!confirmPassword) return;
      this.store.dispatch(signUpUser({ email, password, confirmPassword }));
    } else {
      this.store.dispatch(logInUser({ email, password }));
    }
  }
}
