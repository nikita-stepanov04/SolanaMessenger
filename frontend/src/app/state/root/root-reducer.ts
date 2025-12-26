import {ActionReducer} from '@ngrx/store';
import {rootActions} from './root-actions';

export const rootReducer = {
  clearStateMetaReducer(reducer: ActionReducer<any>): ActionReducer<any> {
    return function (state, action) {
      if (action.type === rootActions.clearStore.type) {
        state = undefined;
      }
      return reducer(state, action);
    };
  }
}
