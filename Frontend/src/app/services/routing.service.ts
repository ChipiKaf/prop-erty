import { Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RoutingService {
  constructor(private router: Router) {}

  navigate(commands: string[], extras?: NavigationExtras) {
    // New logic

    // route as normal
    this.router.navigate(commands, extras);
  }
}
