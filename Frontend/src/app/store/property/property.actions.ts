import { createAction, props } from '@ngrx/store';
import { IPropertyBase } from '../../model/ipropertybase';
import { GetPropertyModel } from '../../model/GetProperty';

export const loadProperties = createAction(
  '[Property-List page] Load Properties'
);

export const loadProperty = createAction(
  '[Property-details page] Load Single Property',
  props<{ id: number }>()
);

export const loadPropertySuccess = createAction(
  '[Properties API] Property Load Success',
  // eslint-disable-next-line @ngrx/prefer-inline-action-props
  props<GetPropertyModel>()
);

export const loadPropertyFailure = createAction(
  '[Properties API] Property Load Failure',
  props<{ error: string }>()
);

export const loadPropertiesSuccess = createAction(
  '[Properties API] Properties Load Success',
  props<{ properties: IPropertyBase[] }>()
);

export const loadPropertiesFailure = createAction(
  '[Properties API] Properties Load Failure',
  props<{ error: string }>()
);

export const likeProperty = createAction(
  '[Property-Like API] Like Property',
  props<{ propertyId: number }>()
);
export const likePropertySuccess = createAction(
  '[Property-Like API] Like Property Success',
  props<{ propertyId: number }>()
);
export const likePropertyFailure = createAction(
  '[Property-Like API] Like Property Failure',
  props<{ propertyId: number }>()
);

export const unlikeProperty = createAction(
  '[Property-Like API] Unlike Property',
  props<{ propertyId: number }>()
);
export const unlikePropertySuccess = createAction(
  '[Property-Like API] Unlike Property Success',
  props<{ propertyId: number }>()
);
export const unlikePropertyFailure = createAction(
  '[Property-Like API] Unlike Property Failure',
  props<{ propertyId: number }>()
);
