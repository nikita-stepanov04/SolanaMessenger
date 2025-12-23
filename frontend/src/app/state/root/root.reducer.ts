import {ActionReducer} from '@ngrx/store';
import {clearStore} from './root.actions';

export function clearStateMetaReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  return function (state, action) {
    if (action.type === clearStore.type) {
      state = undefined;
    }
    return reducer(state, action);
  };
}
