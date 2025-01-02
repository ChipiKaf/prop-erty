import { createReducer, on } from '@ngrx/store';
import { IPropertyBase } from '../../model/ipropertybase';
import {
  likeProperty,
  likePropertySuccess,
  loadProperties,
  loadPropertiesFailure,
  loadPropertiesSuccess,
  loadProperty,
  loadPropertySuccess,
  unlikeProperty,
  unlikePropertySuccess,
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
  ),
  // Like
  on(likeProperty, (state): PropertyState => ({ ...state })),
  on(likePropertySuccess, (state, { propertyId }): PropertyState => {
    return {
      ...state,
      status: 'success',
      properties: state.properties.map((p) =>
        p.id === propertyId
          ? { ...p, likes: (p.likes || 0) + 1 } // create a new object for this property
          : p
      ),
    };
  }),

  on(unlikeProperty, (state): PropertyState => ({ ...state })),
  on(unlikePropertySuccess, (state, { propertyId }): PropertyState => {
    return {
      ...state,
      status: 'success',
      properties: state.properties.map((p) =>
        p.id === propertyId
          ? { ...p, likes: (p.likes || 1) - 1 } // create a new object for this property
          : p
      ),
    };
  })
);
