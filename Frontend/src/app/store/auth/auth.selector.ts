import { createSelector } from '@ngrx/store';
import { AppState } from '../app.store';

export const selectAuth = (state: AppState) => state.auth;
export const selectModel = (state: AppState) => state.auth.model;
export const selectIsAuthenticated = createSelector(
  selectAuth,
  (state) => state.authentication.isAuthenticated
);
export const selectAuthenticationStatus = createSelector(
  selectAuth,
  (state) => state.authentication.status
);
export const selectUser = createSelector(selectModel, (state) => state.user);
export const selectModelStatus = createSelector(
  selectAuth,
  (state) => state.model.status
);
