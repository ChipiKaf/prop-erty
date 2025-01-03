/* eslint-disable @ngrx/no-typed-global-store */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
// import { PropertyCardComponent } from './property/property-card/property-card.component';
// import { PropertyListComponent } from './property/property-list/property-list.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { CommonModule } from '@angular/common';
import { TokenService } from './services/token.service';
import { Store } from '@ngrx/store';
import { ToastComponent } from './components/toast/toast.component';
import {
  selectNotificationMessage,
  selectNotificationType,
} from './store/notification/notification.selector';
import { AppState } from './store/app.store';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { NotificationType } from './store/notification/notification.reducer';
import { resetNotifications } from './store/notification/notification.action';
import { initializeSession } from './store/app.actions';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    NavBarComponent,
    ToastComponent,
    // LoadingScreenComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'prop-erty';
  notificationType$ = this.store.select(selectNotificationType);
  notificationMessage$ = this.store.select(selectNotificationMessage);
  notification$!: Observable<{
    type: NotificationType;
    message: string;
  }>;
  showToast: boolean = false;
  toastTimeout: any = null;
  notificationSubscription!: Subscription;
  constructor(
    public router: Router,
    private tokenService: TokenService,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.notification$ = combineLatest({
      type: this.notificationType$,
      message: this.notificationMessage$,
    });
    this.notificationSubscription = this.notification$.subscribe(
      ({ type, message }) => {
        if (type === null || message === '') return;

        if (this.toastTimeout) clearTimeout(this.toastTimeout);
        this.showToast = true;
        this.toastTimeout = setTimeout(() => {
          this.showToast = false;
          setTimeout(() => {
            this.store.dispatch(resetNotifications());
          }, 500);
        }, 2000);
      }
    );
    if (this.tokenService.hasToken()) {
      // If session still valid, load user on initialization
      this.store.dispatch(initializeSession());
    }
  }
  ngOnDestroy(): void {
    this.notificationSubscription.unsubscribe();
  }

  in3DView(): boolean {
    return this.router.url.includes('property-view-3d');
  }

  inAuth(): boolean {
    return this.router.url.includes('login');
  }
}
