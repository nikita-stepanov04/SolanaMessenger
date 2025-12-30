import {createFeatureSelector, createSelector} from '@ngrx/store';
import {messagesAdapter, MessagesState} from './messges-reducers';
import {OrderedArray} from '../../helpers/sorting';
import {ChatsSelectors} from '../chats/chats-selectors';

const selectMessagesState = createFeatureSelector<MessagesState>('messages');

const { selectAll } = messagesAdapter.getSelectors(selectMessagesState);

export const MessagesSelectors = {
  loading: createSelector(
    ChatsSelectors.chatInfoLoading,
    selectMessagesState,
    (chatInfoLoading, messageState) => chatInfoLoading || messageState.loading),

  loaded: createSelector(
    ChatsSelectors.chatInfoLoaded,
    selectMessagesState,
    (chatInfoLoaded, messageState) => chatInfoLoaded || messageState.loaded),

  messages: createSelector(
    ChatsSelectors.openedChat,
    selectAll,
    (chat, messages) => {
      const filtered = messages.filter(m => m.chatID == chat?.id);
      return new OrderedArray(filtered)
        .orderBy(m => m.timestamp)
        .toArray();
    }
  ),
}
