import { createReducer, on } from '@ngrx/store';
import {
  resetNotifications,
  showError,
  showSuccess,
  showWarning,
} from './notification.action';
export type NotificationType = 'error' | 'warn' | 'success' | null;
export interface NotificationState {
  type: NotificationType;
  message: string;
}

const initialState: NotificationState = {
  type: null,
  message: '',
};

export const notificationReducer = createReducer(
  initialState,
  on(
    showError,
    (state, { message }): NotificationState => ({
      ...state,
      message,
      type: 'error',
    })
  ),
  on(
    showWarning,
    (state, { message }): NotificationState => ({
      ...state,
      message,
      type: 'warn',
    })
  ),
  on(
    showSuccess,
    (state, { message }): NotificationState => ({
      ...state,
      message,
      type: 'success',
    })
  ),
  on(resetNotifications, (): NotificationState => ({ ...initialState }))
);
