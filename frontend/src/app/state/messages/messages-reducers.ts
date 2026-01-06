import {defaultState, DefaultState} from '../default-state';
import {createEntityAdapter, EntityState} from '@ngrx/entity';
import {DecryptedMessage} from './models/decrypted-message';
import {createReducer, on} from '@ngrx/store';
import {MessagesActions} from './messages-actions';

export interface MessagesState extends DefaultState, EntityState<DecryptedMessage> {}

export const messagesAdapter = createEntityAdapter<DecryptedMessage>({
  selectId: message => message.id,
  sortComparer: (a, b) => a.timestamp - b.timestamp,
});
export const initialMessageState: MessagesState = messagesAdapter.getInitialState({
  ...defaultState
});

export const messagesReducer = createReducer(
  initialMessageState,
  on(MessagesActions.loadNextMessagesBatchForOpenedChat, state => ({
    ...state,
    loading: true,
    loaded: false,
    state: null
  })),

  on(MessagesActions.loadMessagesSuccess, (state, {messages}) =>
    messagesAdapter.addMany(messages, {
      ...state,
      loading: false,
      loaded: true,
    })
  ),

  on(MessagesActions.newMessage, (state, {message}) => messagesAdapter.addOne(message, state)),

  on(MessagesActions.sendMessage, (state, {message}) =>
    messagesAdapter.addOne(message, state)),

  on(MessagesActions.sendMessageSuccess, (state, {messageID}) =>
    messagesAdapter.updateOne({
      id: messageID,
      changes: {
        isPending: false
      }
    }, state)),

  on(MessagesActions.sendMessageFailure, (state, {messageID, error}) =>
    messagesAdapter.removeOne(messageID, {
      ...state,
      error: error
    }))
)
