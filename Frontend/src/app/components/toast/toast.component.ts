// toast.component.ts
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { gsap } from 'gsap';
import { NotificationType } from '../../store/notification/notification.reducer';

@Component({
  selector: 'app-toast',
  standalone: true,
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
})
export class ToastComponent implements AfterViewInit, OnDestroy {
  @ViewChild('toast', { static: true })
  toast: ElementRef<HTMLDivElement> | null = null;
  @Input() message: string = ''; // Message to display in the toast
  @Input() type: NotificationType = null;

  private tl!: gsap.core.Timeline; // GSAP timeline

  private _show: boolean = false; // Internal state

  @Input()
  set show(value: boolean) {
    this._show = value;
    if (this.tl) {
      if (value) {
        this.tl.play(); // Play animation to show toast
      } else {
        this.tl.reverse(); // Reverse animation to hide toast
      }
    }
  }

  get show(): boolean {
    return this._show;
  }

  ngAfterViewInit(): void {
    if (!this.toast?.nativeElement) return;

    // Initialize the GSAP timeline with paused state
    this.tl = gsap
      .timeline({ paused: true, defaults: { duration: 0.5 } })
      .to(this.toast.nativeElement, {
        y: '-50px',
        opacity: 1,
        ease: 'power3.out',
      });

    // Set initial state based on the initial value of show
    if (this._show) {
      this.tl.progress(1); // Ensure toast is visible
    } else {
      this.tl.progress(0); // Ensure toast is hidden
    }
  }

  // Method to manually close the toast
  close() {
    this.show = false;
  }

  ngOnDestroy(): void {
    if (this.tl) {
      this.tl.kill(); // Clean up the timeline
    }
  }
}
