import {createFeatureSelector, createSelector} from '@ngrx/store';
import {messagesAdapter, MessagesState} from './messages-reducers';
import {ChatsSelectors, selectChatEntities} from '../chats/chats-selectors';
import {DecryptedMessage} from './models/decrypted-message';

const selectMessagesState = createFeatureSelector<MessagesState>('messages');

const { selectAll, selectEntities } = messagesAdapter.getSelectors(selectMessagesState);

const openedChatMessages = createSelector(
  ChatsSelectors.openedChat,
  selectAll,
  (chat, messages) => chat
    ? messages.filter(m => m.chatID == chat?.id)
    : []
);

export const MessagesSelectors = {
  loading: createSelector(
    ChatsSelectors.chatInfoLoading,
    selectMessagesState,
    (chatInfoLoading, messageState) => chatInfoLoading || messageState.loading),

  loaded: createSelector(
    ChatsSelectors.chatInfoLoaded,
    selectMessagesState,
    (chatInfoLoaded, messageState) => chatInfoLoaded && messageState.loaded),

  openedChatLastMessageTimestamp: createSelector(
    openedChatMessages,
    messages => messages.length > 0
      ? messages[0]?.timestamp ?? 0
      : 0
  ),

  openedChatPreviousMessage: (messageId: string) => createSelector(
    openedChatMessages,
    messages => {
      if (messages.length == 0)
        return null;

      const idx = messages.findIndex(m => m.id === messageId);
      return idx > 0
        ? messages[idx - 1]
        : null;
    }
  ),

  isPending: (id: string) => createSelector(
    selectEntities,
    messages => !!messages[id]?.isPending
  ),

  openedChatMessages
}
