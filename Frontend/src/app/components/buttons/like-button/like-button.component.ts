import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-like-button',
  standalone: true,
  imports: [],
  templateUrl: './like-button.component.html',
  styleUrl: './like-button.component.scss',
})
export class LikeButtonComponent {
  @Output() buttonClicked = new EventEmitter<MouseEvent>();
  @Input() isLiked: boolean = false;
  @Input() likesCount: number = 0;
  public handleIconClick(event: MouseEvent) {
    this.buttonClicked.emit(event);
  }
}
