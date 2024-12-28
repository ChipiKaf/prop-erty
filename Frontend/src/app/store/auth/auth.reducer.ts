import { createReducer, on } from '@ngrx/store';
import {
  loadUser,
  loadUserFailure,
  loadUserSuccessful,
  logInUser,
  logInUserFailure,
  logInUserSuccessful,
  signUpFailure,
  signUpSuccessful,
  signUpUser,
  updateUser,
  updateUserFailure,
  updateUserSuccessful,
} from './auth.actions';
import { UserModel } from '../../model/user';
import { Status } from '../../model/store';
export interface AuthState {
  model: { user: UserModel; status: Status; error: string | null };
  authentication: {
    token: string | null;
    status: Status;
    error: string | null;
  };
}

const initialState: AuthState = {
  model: {
    user: { displayName: '', firstName: '', lastName: '' },
    status: 'pending',
    error: null,
  },
  authentication: { token: null, status: 'pending', error: null },
};

export const authReducer = createReducer(
  initialState,
  on(
    logInUser,
    (state): AuthState => ({
      ...state,
      authentication: { ...state.authentication, status: 'loading' },
    })
  ),
  on(
    logInUserSuccessful,
    (state, { token }): AuthState => ({
      ...state,
      authentication: {
        ...state.authentication,
        token,
        status: 'success',
        error: null,
      },
    })
  ),
  on(
    logInUserFailure,
    (state, { error }): AuthState => ({
      ...state,
      authentication: { ...state.authentication, error, status: 'error' },
    })
  ),
  on(
    signUpUser,
    (state): AuthState => ({
      ...state,
      authentication: { ...state.authentication, status: 'loading' },
    })
  ),
  on(
    signUpSuccessful,
    (state, { token }): AuthState => ({
      ...state,
      authentication: {
        ...state.authentication,
        token,
        status: 'success',
        error: null,
      },
    })
  ),
  on(
    signUpFailure,
    (state, { error }): AuthState => ({
      ...state,
      authentication: { ...state.authentication, error, status: 'error' },
    })
  ),
  on(
    loadUser,
    (state): AuthState => ({
      ...state,
      model: { ...state.model, status: 'pending' },
    })
  ),
  on(
    loadUserSuccessful,
    (state, { displayName, firstName, lastName }): AuthState => ({
      ...state,
      model: {
        ...state.model,
        user: { displayName, firstName, lastName },
        status: 'success',
        error: null,
      },
    })
  ),
  on(
    loadUserFailure,
    (state, { error }): AuthState => ({
      ...state,
      model: {
        ...state.model,
        status: 'error',
        error,
      },
    })
  ),
  on(
    updateUser,
    (state): AuthState => ({
      ...state,
      model: { ...state.model, status: 'loading' },
    })
  ),
  on(
    updateUserSuccessful,
    (state, { displayName, firstName, lastName }): AuthState => ({
      ...state,
      model: {
        ...state.model,
        user: { displayName, firstName, lastName },
        status: 'success',
        error: null,
      },
    })
  ),
  on(
    updateUserFailure,
    (state, { error }): AuthState => ({
      ...state,
      model: {
        ...state.model,
        status: 'error',
        error,
      },
    })
  )
);
