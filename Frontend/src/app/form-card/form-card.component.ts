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
import { RoutingService } from '../services/routing.service';

@Component({
  selector: 'app-form-card',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './form-card.component.html',
  styleUrl: './form-card.component.scss',
})
export class FormCardComponent {
  isSignup: boolean = false;
  isSubmitting: boolean = false;
  showLoader: boolean = false;

  authForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl(''),
  });

  constructor(
    private authService: AuthService,
    private router: RoutingService
  ) {}

  toggleAuthPage() {
    console.log('Clicked');
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
    this.isSubmitting = true;
    // Loader grace period
    setTimeout(() => {
      this.showLoader = true;
    }, 300);
    if (!this.authForm.valid) return;
    console.log(`Valid form`);
    const { email, password, confirmPassword } = this.authForm.value;
    if (!email || !password) return;

    if (this.isSignup) {
      if (!confirmPassword) return;
      this.authService
        .registerUser({
          email,
          password,
          confirmPassword,
        })
        .subscribe({
          next: (value) => {
            console.log(value);
          },
          complete: () => {
            this.isSubmitting = false;
            this.showLoader = false;
          },
        });
    } else {
      this.authService.authUser({ email, password }).subscribe({
        next: (res) => {
          localStorage.setItem('token', res.token);
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error('Authentication failed ', err);
        },
        complete: () => {
          this.isSubmitting = false;
          this.showLoader = false;
        },
      });
    }
  }
}
