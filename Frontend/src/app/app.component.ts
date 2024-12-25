import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
// import { PropertyCardComponent } from './property/property-card/property-card.component';
// import { PropertyListComponent } from './property/property-list/property-list.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { CommonModule } from '@angular/common';
import { LoadingScreenComponent } from './components/loading-screen/loading-screen.component';
// import { GradientOverlayComponent } from './gradient-overlay/gradient-overlay.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    // PropertyCardComponent,
    // PropertyListComponent,
    // GradientOverlayComponent,
    CommonModule,
    NavBarComponent,
    LoadingScreenComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'prop-erty';

  constructor(public router: Router) {}

  in3DView(): boolean {
    return this.router.url.includes('property-view-3d');
  }

  inAuth(): boolean {
    return this.router.url.includes('login');
  }
}
