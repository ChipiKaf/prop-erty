import { createAction, props } from '@ngrx/store';

export const showError = createAction(
  '[Notification state] Show Error',
  props<{ message: string }>()
);

export const showWarning = createAction(
  '[Notification state] Show Warning',
  props<{ message: string }>()
);

export const showSuccess = createAction(
  '[Notification state] Show Success',
  props<{ message: string }>()
);

export const showNeutral = createAction(
  '[Notification state] Show Neutral',
  props<{ message: string }>()
);

export const resetNotifications = createAction(
  '[Notification state] Reset state'
);
