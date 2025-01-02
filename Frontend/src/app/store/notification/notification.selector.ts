import { createSelector } from '@ngrx/store';
import { AppState } from '../app.store';
import { NotificationState } from './notification.reducer';

export const selectNotification = (state: AppState) => state.notification;
export const selectNotificationType = createSelector(
  selectNotification,
  (state: NotificationState) => state.type
);
export const selectNotificationMessage = createSelector(
  selectNotification,
  (state: NotificationState) => state.message
);
