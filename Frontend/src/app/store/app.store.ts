import { AuthState } from './auth/auth.reducer';
import { PropertyState } from './property/property.reducer';

export interface AppState {
  properties: PropertyState;
  auth: AuthState;
}
