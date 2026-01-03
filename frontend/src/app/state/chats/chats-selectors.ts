import { createFeatureSelector, createSelector } from '@ngrx/store';
import { chatsAdapter, ChatsState } from './chats-reducers';
import {OrderedArray} from '../../helpers/sorting';

const selectChatsState = createFeatureSelector<ChatsState>('chats');

export const {
  selectAll: selectAllChats,
  selectEntities: selectChatEntities
} = chatsAdapter.getSelectors(selectChatsState);

export const ChatsSelectors = {
  loading: createSelector(selectChatsState, state => state.loading),
  loaded: createSelector(selectChatsState, state => state.loaded),
  search: createSelector(selectChatsState, state => state.searchName),
  allByName: createSelector(
    selectAllChats,
    createSelector(selectChatsState, state => state.searchName),
    (chats, search) => {
      const filtered = search
        ? chats.filter(chat =>
          chat.name.toLowerCase().includes(search.trim().toLowerCase()))
        : chats;
      return new OrderedArray(filtered)
        .orderByDescending(ch => ch.lastVisited)
        .toArray();
    }
  ),
  isChatOpened: createSelector(selectChatsState, state => !!state.selectedChatID),
  chatInfoLoading: createSelector(selectChatsState, state => state.chatInfoLoading),
  chatInfoLoaded: createSelector(selectChatsState, state => state.chatInfoLoaded),

  openedChat: createSelector(
    selectChatEntities,
    selectChatsState,
    (entities, state) => state.selectedChatID ? entities[state.selectedChatID] : null),

  areAllMessagesFetchedForOpenedChat: createSelector(
    selectChatsState,
    selectChatEntities,
    (state, entities) => {
      const chat = entities[state.selectedChatID];
      return !!chat?.areAllMessagesFetched;
    }
  )
};
