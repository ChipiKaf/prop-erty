import { Component } from '@angular/core';
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

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    FormInputComponent,
    FormButtonComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
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
  isSubmitting = false;

  handleSubmit() {}
}
