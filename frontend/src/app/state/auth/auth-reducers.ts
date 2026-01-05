import {defaultState, DefaultState} from '../default-state';
import {UserInfo} from './models/resp/userInfo';
import {createReducer, on} from '@ngrx/store';
import {TokensInfo} from './models/resp/tokensInfo';
import {AuthActions} from './auth-actions';

export interface AuthState extends DefaultState {
  tokenInfo: TokensInfo | null;
  userInfo: UserInfo | null;
  x25519Priv: string;
}

export const initialAuthState: AuthState = {
  ...defaultState,
  tokenInfo: null,
  userInfo: null,
  x25519Priv: ''
};

export const authReducers = createReducer(

  // Login
  initialAuthState,
  on(AuthActions.login, state => ({...state, loading: true, loaded: false, error: null})),
  on(AuthActions.loginSuccess, (state, {tokenInfo, x25519Priv}) => ({
    ...state,
    loading: true,
    loaded: false,
    error: null,
    tokenInfo: tokenInfo,
    userInfo: null,
    x25519Priv: x25519Priv
  })),
  on(AuthActions.loginError, (state, {error}) => ({ ...state, loading: false, loaded: false, error: error})),

  // UserInfo
  on(AuthActions.userInfoSuccess, (state, {userInfo}) => ({
    ...state,
    loaded: true,
    loading: false,
    error: null,
    userInfo: userInfo
  })),
  on(AuthActions.userInfoError, (state, {error}) => ({ ...state, loading: false, loaded: false, error: error})),

  // Register
  on(AuthActions.register, state => ({...state, loading: true, loaded: false, error: null})),
  on(AuthActions.registerSuccess, state => ({
    ...state,
    loading: false,
    loaded: true,
    error: null,
  })),
  on(AuthActions.registerError, (state, {error}) => ({ ...state, loading: false, loaded: false, error: error})),

  // Refresh
  on(AuthActions.refresh, state => ({...state, loading: true, loaded: false, error: null})),
  on(AuthActions.refreshSuccess, (state, {accessTokensInfo}) => ({
    ...state,
    loading: false,
    loaded: true,
    tokenInfo: new TokensInfo(accessTokensInfo.accessToken, state.tokenInfo!.refreshToken)
  })),
  on(AuthActions.refreshError, (state, {error}) => ({ ...state, loading: false, loaded: false, error: error})),
)

