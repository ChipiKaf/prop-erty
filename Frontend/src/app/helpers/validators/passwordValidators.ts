import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

export function passwordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value || '';

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasDigit = /[0-9]/.test(value);
    const hasNonAlphanumeric = /[^a-zA-Z0-9]/.test(value);
    const isValidLength = value.length >= 6;

    const errors: ValidationErrors = {};

    if (!hasUpperCase) {
      errors['upperCase'] = 'Password must have at least one uppercase letter';
    }

    if (!hasLowerCase) {
      errors['lowerCase'] = 'Password must have at least one lowercase letter';
    }

    if (!hasDigit) {
      errors['digit'] = 'Password must have at least one digit.';
    }

    if (!hasNonAlphanumeric) {
      errors['nonAlphanumeric'] =
        'Password must have at least one special character';
    }

    if (!isValidLength) {
      errors['minLength'] = 'Password must be at least 6 characters long';
    }

    return Object.keys(errors).length ? errors : null;
  };
}

export function passwordMatchValidator(): ValidatorFn {
  return (control: AbstractControl) => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    if (password !== confirmPassword) {
      return { passwordMismatch: true };
    }

    return null;
  };
}
