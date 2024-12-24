import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-form-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-card.component.html',
  styleUrl: './form-card.component.scss',
})
export class FormCardComponent {
  isSignup: boolean = false;

  handleOnSignup() {
    console.log('Clicked');
    this.isSignup = !this.isSignup;
    console.log(this.isSignup);
  }
}
