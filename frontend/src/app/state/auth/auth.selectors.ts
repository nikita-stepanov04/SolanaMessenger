import {createFeatureSelector, createSelector} from '@ngrx/store';
import {AuthState} from './auth-reducers';
import {Polices} from '@models/enums/policies';
import {POLICY_ALLOWED_ROLES} from './models/policy-allowed-roles';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const AuthSelectors = {
  state: createSelector(selectAuthState, state => state),
  userInfo: createSelector(selectAuthState, state => state.userInfo),
  tokenInfo: createSelector(selectAuthState, state => state.tokenInfo),
  loading: createSelector(selectAuthState, state => state.loading),
  loaded: createSelector(selectAuthState, state => state.loaded),
  error: createSelector(selectAuthState, state => state.error),

  isAuthorized: (policy: Polices) => createSelector(
    selectAuthState,
    authState => {
      if (policy == Polices.NotAuthorized)
        return true;

      if (!authState.userInfo)
        return false;

      const policyData = POLICY_ALLOWED_ROLES.find(p => p.Policy === policy);
      return policyData?.Roles.find(r => r == authState.userInfo!.role) !== undefined;
    }
  )
}
