import { createFeatureSelector, createSelector } from '@ngrx/store';
import { chatsAdapter, ChatsState } from './chats-reducers';
import {OrderedArray} from '../../helpers/sorting';

const selectChatsState = createFeatureSelector<ChatsState>('chats');

const { selectAll } = chatsAdapter.getSelectors(selectChatsState);

export const ChatsSelectors = {
  loading: createSelector(selectChatsState, state => state.loading),
  loaded: createSelector(selectChatsState, state => state.loaded),
  search: createSelector(selectChatsState, state => state.searchName),
  allByName: createSelector(
    selectAll,
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
};
