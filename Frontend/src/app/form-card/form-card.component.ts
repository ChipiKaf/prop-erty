import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
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

@Component({
  selector: 'app-form-card',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './form-card.component.html',
  styleUrl: './form-card.component.scss',
})
export class FormCardComponent {
  isSignup: boolean = false;

  authForm = new FormGroup(
    {
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl(''),
    },
    { validators: passwordMatchValidator() }
  );

  constructor(private authService: AuthService) {}

  toggleAuthPage() {
    console.log('Clicked');
    this.isSignup = !this.isSignup;
    const confirmPassword = this.authForm.get('confirmPassword');
    const password = this.authForm.get('password');
    if (this.isSignup) {
      confirmPassword?.setValidators([Validators.required]);
      password?.setValidators([Validators.required, passwordValidator()])
    } else {
      confirmPassword?.clearValidators();
      password?.setValidators([Validators.required]);
    }
    confirmPassword?.updateValueAndValidity();
    password?.updateValueAndValidity();
  }

  handleSubmit() {
    console.log(`Submitting ${this.isSignup ? 'sign up' : 'Log in'}`);

    if (!this.authForm.valid) return;

    if (this.isSignup) {
      const { email, password, confirmPassword } = this.authForm.value;
      if (!email || !password || !confirmPassword) return;
      this.authService
        .registerUser({
          email,
          password,
          confirmPassword,
        })
        .subscribe((value) => {
          console.log(value);
        });
    }
  }
}
