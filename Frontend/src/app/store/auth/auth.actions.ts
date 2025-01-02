/* eslint-disable @ngrx/prefer-inline-action-props */
import { createAction, props } from '@ngrx/store';
import { UserForLogin, UserForRegister, UserModel } from '../../model/user';

// Log in
export const logInUser = createAction(
  '[Auth API] Logging in user',
  props<UserForLogin>()
);
export const logInUserSuccessful = createAction(
  '[Auth API] Log in user successful',
  props<{ token: string }>()
);
export const logInUserFailure = createAction(
  '[Auth API] Log in user failure',
  props<{ error: string }>()
);

// Sign up
export const signUpUser = createAction(
  '[Auth API] Signing up user',
  props<UserForRegister>()
);
export const signUpSuccessful = createAction(
  '[Auth API] Sign up user successful',
  props<{ token: string }>()
);
export const signUpFailure = createAction(
  '[Auth API] Sign up user failure',
  props<{ error: string }>()
);

// Fetch User
export const loadUser = createAction('[Auth API] Getting user');
export const loadUserSuccessful = createAction(
  '[Auth API] Get user successful',
  props<UserModel>()
);
export const loadUserFailure = createAction(
  '[Auth API] Get user Failure',
  props<{ error: string | null }>()
);

// Update User
export const updateUser = createAction(
  '[Auth API] Updating user',
  props<UserModel>()
);
export const updateUserSuccessful = createAction(
  '[Auth API] Update user successful',
  props<UserModel>()
);
export const updateUserFailure = createAction(
  '[Auth API] Update user Failure',
  props<{ error: string | null }>()
);

// Like Property
export const userLikeProperty = createAction(
  '[Property-list/Property-details page] User Like Property',
  props<{ propertyId: number }>()
);

export const userUnlikeProperty = createAction(
  '[Property-list/Property-details page] User Unlike Property',
  props<{ propertyId: number }>()
);

export const userUnlikePropertyFailure = createAction(
  '[Property-list/Property-details page] User Unlike Property Failure',
  props<{ propertyId: number }>()
);

export const userLikePropertyFailure = createAction(
  '[Property-list/Property-details page] User Like Property Failure',
  props<{ propertyId: number }>()
);
