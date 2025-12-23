import {createFeatureSelector, createSelector} from '@ngrx/store';
import {chatsAdapter, ChatsState} from './chats.reducer';

export const selectChatsState = createFeatureSelector<ChatsState>('chats');

const {
  selectAll,
} = chatsAdapter.getSelectors(selectChatsState);

export const selectAllChats = selectAll;

export const selectChatsLoading = createSelector(
  selectChatsState,
  state => state.loading
);

export const selectChatsLoaded = createSelector(
  selectChatsState,
  state => state.loaded
);

export const selectChatsSearch = createSelector(
  selectChatsState,
  state => state.searchName
);

export const selectChatsByName = createSelector(
    selectAllChats,
    selectChatsSearch,
    ((chats, search) => !search
      ? chats
      : chats.filter(chat =>
        chat.name
          .toLowerCase()
          .includes(search
              .trim()
              .toLowerCase()))
  ));
