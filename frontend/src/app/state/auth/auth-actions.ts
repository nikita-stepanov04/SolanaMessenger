import {createAction, props} from '@ngrx/store';
import {UserLoginInfo} from './models/req/userLoginInfo';
import {UserInfo} from './models/resp/userInfo';
import {TokensInfo} from './models/resp/tokensInfo';
import {AccessTokenInfo} from './models/resp/accessTokenInfo';
import {UserRegisterInfo} from './models/req/userRegisterInfo';

export const AuthActions = {
  login: createAction('[Login] Login', props<{ loginInfo: UserLoginInfo }>()),
  loginSuccess: createAction('[Login] Login Success', props<{
    tokenInfo: TokensInfo,
    login: string,
    x25519Priv: string
  }>()),
  loginError: createAction('[Login] Login Error', props<{ error: any }>()),

  logout: createAction('[Logout] Logout'),

  register: createAction('[Register] Register', props<{ registerInfo: UserRegisterInfo }>()),
  registerSuccess: createAction('[Register] Register Success'),
  registerError: createAction('[Register] Register Error', props<{ error: any }>()),

  refresh: createAction('[Refresh] Refresh'),
  refreshSuccess: createAction('[Refresh] Refresh Success', props<{ accessTokensInfo: AccessTokenInfo }>()),
  refreshError: createAction('[Refresh] Refresh Error', props<{ error: any }>()),

  userInfoSuccess: createAction('[UserInfo] Info success', props<{ userInfo: UserInfo }>()),
  userInfoError: createAction('[UserInfo] Info Error', props<{ error: any }>()),
}
