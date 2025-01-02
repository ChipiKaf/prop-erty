import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { AuthService } from '../../services/auth.service';
import { RoutingService } from '../../services/routing.service';

@Injectable()
export class NotificationEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: RoutingService
  ) {}
}
