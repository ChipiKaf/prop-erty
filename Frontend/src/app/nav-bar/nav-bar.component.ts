import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { RoutingService } from '../services/routing.service';
import { TokenService } from '../services/token.service';
import { gsap } from 'gsap';

export enum ListItemTypes {
  ALL,
  AUTHENTICATED,
  UNAUTHENTICATED,
}

export type ListItem = {
  name: string;
  url: string;
  type: ListItemTypes;
  actions?: () => void;
};

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent {
  active: boolean = false;
  listItems: ListItem[] = [
    {
      name: 'Properties',
      url: '/',
      type: ListItemTypes.ALL,
    },
    {
      name: 'Contact',
      url: '/',
      type: ListItemTypes.UNAUTHENTICATED,
    },
    {
      name: 'Profile',
      url: '/profile',
      type: ListItemTypes.AUTHENTICATED,
    },
    {
      name: 'Logout',
      url: '/login',
      type: ListItemTypes.AUTHENTICATED,
      actions: () => {
        localStorage.removeItem('token');
      },
    },
  ];

  constructor(
    private router: RoutingService,
    private nativeRouter: Router,
    private tokenService: TokenService
  ) {}

  toggleMenu() {
    this.active = !this.active;
  }

  isItemVisible(item: ListItem): boolean {
    return (
      item.type === ListItemTypes.ALL ||
      (item.type === ListItemTypes.UNAUTHENTICATED &&
        !this.tokenService.hasToken()) ||
      (item.type === ListItemTypes.AUTHENTICATED &&
        this.tokenService.hasToken())
    );
  }

  shakeAnimation(element: HTMLElement) {
    const tl = gsap.timeline();
    tl.to(element, {
      duration: 0.1,
      x: -5,
      yoyo: true,
      repeat: 5,
      ease: 'power1.inOut',
    });
    console.log('Shaking');
    // tl.play();
    // tl.to()
  }

  navigate(item: ListItem, element: HTMLElement) {
    if (item.actions) item.actions();
    if (item.url === this.nativeRouter.url) {
      this.shakeAnimation(element);
      return;
    }
    this.router.navigate([item.url]);
  }
}
