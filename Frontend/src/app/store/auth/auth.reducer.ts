import { createReducer, on } from '@ngrx/store';
import {
  isAuthed,
  isNotAuthed,
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
  userLikeProperty,
  userLikePropertyFailure,
  userLogout,
  userUnlikeProperty,
  userUnlikePropertyFailure,
} from './auth.actions';
import { UserModel } from '../../model/user';
import { Status } from '../../model/store';
export interface AuthState {
  model: { user: UserModel; status: Status; error: string | null };
  authentication: {
    isAuthenticated: boolean;
    status: Status;
    error: string | null;
  };
}

const initialState: AuthState = {
  model: {
    user: { displayName: '', firstName: '', lastName: '', likes: null },
    status: 'pending',
    error: null,
  },
  authentication: { isAuthenticated: false, status: 'pending', error: null },
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
    (state): AuthState => ({
      ...state,
      authentication: {
        ...state.authentication,
        isAuthenticated: true,
        status: 'success',
        error: null,
      },
    })
  ),
  on(
    logInUserFailure,
    (state, { error }): AuthState => ({
      ...state,
      authentication: {
        ...state.authentication,
        isAuthenticated: false,
        error,
        status: 'error',
      },
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
    (state): AuthState => ({
      ...state,
      authentication: {
        ...state.authentication,
        isAuthenticated: true,
        status: 'success',
        error: null,
      },
    })
  ),
  on(
    isAuthed,
    (state): AuthState => ({
      ...state,
      authentication: {
        ...state.authentication,
        isAuthenticated: true,
      },
    })
  ),
  on(
    isNotAuthed,
    (state): AuthState => ({
      ...state,
      authentication: {
        ...state.authentication,
        isAuthenticated: false,
      },
    })
  ),
  on(
    signUpFailure,
    (state, { error }): AuthState => ({
      ...state,
      authentication: {
        ...state.authentication,
        isAuthenticated: false,
        error,
        status: 'error',
      },
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
    (state, { displayName, firstName, lastName, likes }): AuthState => ({
      ...state,
      model: {
        ...state.model,
        user: { displayName, firstName, lastName, likes },
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
    (state, { displayName, firstName, lastName, likes }): AuthState => ({
      ...state,
      model: {
        ...state.model,
        user: { displayName, firstName, lastName, likes },
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
  ),
  on(
    userLikeProperty,
    (state, { propertyId }): AuthState => ({
      ...state,
      model: {
        ...state.model,
        user: {
          ...state.model.user,
          likes: [
            ...(state.model.user.likes || []),
            {
              id: state.model.user.likes?.length || 1,
              propertyId,
              lastUpdatedOn: Date.now().toString(),
              lastUpdatedBy: 0,
            },
          ],
        },
      },
    })
  ),
  on(
    userLikePropertyFailure,
    (state, { propertyId }): AuthState => ({
      ...state,
      model: {
        ...state.model,
        user: {
          ...state.model.user,
          likes: [
            ...(state.model.user.likes || []).filter(
              (prop) => prop.propertyId !== propertyId
            ),
          ],
        },
      },
    })
  ),
  // on()
  on(
    userUnlikeProperty,
    (state, { propertyId }): AuthState => ({
      ...state,
      model: {
        ...state.model,
        user: {
          ...state.model.user,
          likes: [
            ...(state.model.user.likes || []).filter(
              (prop) => prop.propertyId !== propertyId
            ),
          ],
        },
      },
    })
  ),
  on(
    userUnlikePropertyFailure,
    (state, { propertyId }): AuthState => ({
      ...state,
      model: {
        ...state.model,
        user: {
          ...state.model.user,
          likes: [
            ...(state.model.user.likes || []),
            {
              id: state.model.user.likes?.length || 1,
              propertyId,
              lastUpdatedOn: Date.now().toString(),
              lastUpdatedBy: 0,
            },
          ],
        },
      },
    })
  ),
  on(userLogout, (): AuthState => ({ ...initialState }))
);
