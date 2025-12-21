import {createFeatureSelector, createSelector} from '@ngrx/store';
import {chatsAdapter, ChatsState} from './chats.reducer';

export const selectChatsState = createFeatureSelector<ChatsState>('chats');

const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal
} = chatsAdapter.getSelectors(selectChatsState);

export const selectChatIds = selectIds;
export const selectChatEntities = selectEntities;
export const selectAllChats = selectAll;
export const selectChatsTotal = selectTotal;

export const selectChatsLoading = createSelector(
  selectChatsState,
  state => state.loading
);

export const selectChatsLoaded = createSelector(
  selectChatsState,
  state => state.loaded
);

export const selectChatsError = createSelector(
  selectChatsState,
  state => state.error
);
