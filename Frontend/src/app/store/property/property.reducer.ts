import { createReducer, on } from '@ngrx/store';
import { IPropertyBase } from '../../model/ipropertybase';
import {
  loadProperties,
  loadPropertiesFailure,
  loadPropertiesSuccess,
  loadProperty,
  loadPropertySuccess,
} from './property.actions';
import { Status } from '../../model/store';

export interface PropertyState {
  properties: IPropertyBase[];
  error: string | null;
  status: Status;
}

export const initialState: PropertyState = {
  properties: [],
  error: null,
  status: 'pending',
};

export const propertyReducer = createReducer(
  initialState,
  // Trigger loading properties
  on(
    loadProperty,
    (state): PropertyState => ({
      ...state,
      status: 'loading',
    })
  ),
  on(
    loadPropertySuccess,
    (state, { currentItem, nextItem, prevItem }): PropertyState => ({
      ...state,
      properties: [prevItem, currentItem, nextItem].filter(
        (val) => val !== null
      ),
      error: null,
      status: 'success',
    })
  ),
  on(
    loadPropertiesFailure,
    (state, { error }): PropertyState => ({
      ...state,
      error,
      status: 'error',
    })
  ),
  on(
    loadProperties,
    (state): PropertyState => ({ ...state, status: 'loading' })
  ),
  // Handle successfully loaded properties
  on(
    loadPropertiesSuccess,
    (state, { properties }): PropertyState => ({
      ...state,
      properties,
      error: null,
      status: 'success',
    })
  ),
  on(
    loadPropertiesFailure,
    (state, { error }): PropertyState => ({ ...state, error, status: 'error' })
  )
);
