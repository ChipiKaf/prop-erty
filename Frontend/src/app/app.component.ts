import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
// import { PropertyCardComponent } from './property/property-card/property-card.component';
// import { PropertyListComponent } from './property/property-list/property-list.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { CommonModule } from '@angular/common';
import { TokenService } from './services/token.service';
import { Store } from '@ngrx/store';
import { loadUser } from './store/auth/auth.actions';
// import { GradientOverlayComponent } from './gradient-overlay/gradient-overlay.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    NavBarComponent,
    // LoadingScreenComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'prop-erty';

  constructor(
    public router: Router,
    private tokenService: TokenService,
    private store: Store
  ) {}

  ngOnInit(): void {
    if (this.tokenService.hasToken()) {
      this.store.dispatch(loadUser());
    }
  }

  in3DView(): boolean {
    return this.router.url.includes('property-view-3d');
  }

  inAuth(): boolean {
    return this.router.url.includes('login');
  }
}
