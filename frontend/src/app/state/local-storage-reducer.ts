import { ActionReducer} from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';
import {persistentReducers} from './register-reducers';

export function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  return localStorageSync({
    keys: persistentReducers,
    rehydrate: true
  })(reducer);
}
