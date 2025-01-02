import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-form-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-button.component.html',
  styleUrl: './form-button.component.scss',
})
export class FormButtonComponent implements OnInit {
  @Input() disabled: boolean = false;
  @Output() handleSubmit = new EventEmitter<void>();
  @Input() showLoader: boolean = false;
  isActive = false;

  ngOnInit(): void {
    setTimeout(() => {
      this.isActive = true;
    }, 2000);
  }
}
