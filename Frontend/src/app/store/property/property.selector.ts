import { createSelector } from '@ngrx/store';
import { AppState } from '../app.store';
import { PropertyState } from './property.reducer';

export const selectProperties = (state: AppState) => state.properties;
export const selectAllProperties = createSelector(
  selectProperties,
  (state: PropertyState) => state.properties
);
export const selectPropertiesFetchStatus = createSelector(
  selectProperties,
  (state: PropertyState) => state.status
);
