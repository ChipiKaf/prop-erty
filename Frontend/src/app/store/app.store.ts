import { AuthState } from './auth/auth.reducer';
import { NotificationState } from './notification/notification.reducer';
import { PropertyState } from './property/property.reducer';

export interface AppState {
  properties: PropertyState;
  auth: AuthState;
  notification: NotificationState;
}
