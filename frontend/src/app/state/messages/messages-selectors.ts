import {createFeatureSelector, createSelector} from '@ngrx/store';
import {messagesAdapter, MessagesState} from './messges-reducers';
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

  openedChatMessages: createSelector(
    ChatsSelectors.openedChat,
    selectAll,
    (chat, messages) => messages.filter(m => m.chatID == chat?.id)),

  openedChatLastMessageTimestamp: createSelector(
    ChatsSelectors.openedChat,
    selectAll,
    (chat, messages) => {
      const filtered = messages.filter(m => m.chatID == chat?.id);
      return filtered[0]?.timestamp ?? 0;
    }),

  openedChatPreviousMessage: (messageId: string) =>
    createSelector(
      ChatsSelectors.openedChat,
      selectAll,
      (chat, messages) => {
        if (!chat) return null;

        // filter messages for the opened chat
        const filtered = messages.filter(m => m.chatID === chat.id);

        // find index of the current message
        const idx = filtered.findIndex(m => m.id === messageId);
        if (idx <= 0) return null; // no previous message

        return filtered[idx - 1];
      }
    )
}
