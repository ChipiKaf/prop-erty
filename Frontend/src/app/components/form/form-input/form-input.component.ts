/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, Input, forwardRef } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormGroupDirective,
  ControlContainer,
  ReactiveFormsModule,
} from '@angular/forms';
export type ErrorInput = { text: string; show: boolean };
@Component({
  selector: 'app-form-input',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './form-input.component.html',
  styleUrl: './form-input.component.scss',
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormInputComponent),
      multi: true,
    },
  ],
})
export class FormInputComponent implements ControlValueAccessor {
  @Input() inputId: string = '';
  @Input() label: string = '';
  @Input() type: string = 'text';
  @Input() autocomplete: string = '';
  @Input() required: boolean = false;
  @Input() errors: ErrorInput[] = [];

  // Hold internal input value
  value: any = '';
  isDisabled: boolean = false;

  // Callbacks for ControlValueAccessor
  onChange: (_: any) => void = () => {};
  onTouched: () => void = () => {};

  // Called by Angular to write a value to the control
  writeValue(value: any): void {
    this.value = value;
  }

  // Register a change callback
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  // Register a touched callback
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // Handle disable state
  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  // Emit changes to Angular forms API
  onInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(this.value);
  }

  // Mark the field as touched
  onInputBlur(): void {
    this.onTouched();
  }
}
