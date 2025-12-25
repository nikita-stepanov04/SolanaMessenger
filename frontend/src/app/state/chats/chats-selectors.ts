import { createFeatureSelector, createSelector } from '@ngrx/store';
import { chatsAdapter, ChatsState } from './chats-reducers';

const selectChatsState = createFeatureSelector<ChatsState>('chats');

const { selectAll } = chatsAdapter.getSelectors(selectChatsState);

export const ChatsSelectors = {
  all: selectAll,
  loading: createSelector(selectChatsState, state => state.loading),
  loaded: createSelector(selectChatsState, state => state.loaded),
  search: createSelector(selectChatsState, state => state.searchName),
  allByName: createSelector(
    selectAll,
    createSelector(selectChatsState, state => state.searchName),
    (chats, search) =>
      !search
        ? chats
        : chats.filter(chat =>
          chat.name.toLowerCase().includes(search.trim().toLowerCase())
        )
  ),
};
