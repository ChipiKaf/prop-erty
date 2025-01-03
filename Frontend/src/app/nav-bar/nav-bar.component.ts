/* eslint-disable @ngrx/no-typed-global-store */
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { RoutingService } from '../services/routing.service';
import { TokenService } from '../services/token.service';
import { gsap } from 'gsap';
import { Subscription } from 'rxjs';
import { AppState } from '../store/app.store';
import { Store } from '@ngrx/store';
import { userLogout } from '../store/auth/auth.actions';

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
export class NavBarComponent implements AfterViewInit {
  @ViewChild('menu', { static: true }) menu: ElementRef<HTMLDivElement> | null =
    null;
  @ViewChild('menuList', { static: true })
  menuList: ElementRef<HTMLDivElement> | null = null;
  @ViewChildren('menuText')
  menuTexts: QueryList<ElementRef<HTMLSpanElement>> | null = null;
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
        this.store.dispatch(userLogout());
      },
    },
  ];
  menuTl = gsap.timeline({ defaults: { duration: 0.3, ease: 'power2.inOut' } });
  menuTextsSubscription!: Subscription;
  constructor(
    private router: RoutingService,
    private nativeRouter: Router,
    private tokenService: TokenService,
    private store: Store<AppState>
  ) {}

  ngAfterViewInit(): void {
    this.setupAnimation();
    this.menuTextsSubscription = this.menuTexts!.changes.subscribe(() => {
      // When menuTexts change, re-setup the animation
      this.setupAnimation();
    });
  }

  private setupAnimation() {
    if (this.menuTl.isActive()) {
      setTimeout(() => {
        this.reinstantiateTimeline();
      }, 1000);
    } else {
      this.reinstantiateTimeline();
    }
  }

  private reinstantiateTimeline() {
    this.menuTl.clear();
    const menuTextElements = this.menuTexts!.toArray().map(
      (el) => el.nativeElement
    );
    this.menuTl
      .to(this.menu!.nativeElement, {
        scale: 50,
      })
      .set(
        this.menuList!.nativeElement,
        { display: 'flex', zIndex: 30 },
        '<+0.2'
      )
      .to(menuTextElements, {
        yPercent: -100,
      });
    this.menuTl.pause();
  }
  toggleMenu() {
    this.active = !this.active;
    if (this.active) {
      this.menuTl.play();
    } else {
      this.menuTl.reverse();
    }
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
  }

  navigate(item: ListItem, element: HTMLElement, isMenu = false) {
    if (item.actions) item.actions();
    if (item.url === this.nativeRouter.url) {
      this.shakeAnimation(element);
      return;
    }
    if (isMenu) this.toggleMenu();
    this.router.navigate([item.url]);
  }
}
