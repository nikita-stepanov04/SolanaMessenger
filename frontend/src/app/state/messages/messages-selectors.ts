import {createFeatureSelector, createSelector} from '@ngrx/store';
import {messagesAdapter, MessagesState} from './messages-reducers';
import {ChatsSelectors, selectChatEntities} from '../chats/chats-selectors';

const selectMessagesState = createFeatureSelector<MessagesState>('messages');

const { selectAll, selectEntities } = messagesAdapter.getSelectors(selectMessagesState);

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
      return filtered.length > 0
        ? filtered[0]?.timestamp ?? 0
        : 0;
    }),

  previousMessage: (messageId: string, chatID: string) =>
    createSelector(
      selectChatEntities,
      selectAll,
      (entities, messages) => {
        const chat = entities[chatID];
        if (!chat) return null;

        // console.log(messages)
        const filtered = messages.filter(m => m.chatID === chat!.id);
        if (filtered.length == 0)
          return null;

        const idx = filtered.findIndex(m => m.id === messageId);
        return idx > 0
          ? filtered[idx - 1]
          : null;
      }
    ),

  calculatePreviousMessagesForOpenedChat: (index: number) => createSelector(
    ChatsSelectors.openedChat,
    selectAll,
    (chat, messages) => {
      if (!chat) return 0;

      const filtered = messages.filter(m => m.chatID === chat!.id);
      const message = filtered[index];
      return filtered.filter(m => m.timestamp < message.timestamp).length;
    }
  ),

  isPending: (id: string) => createSelector(
    selectEntities,
    messages => !!messages[id]?.isPending
  )
}
