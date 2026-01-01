import {defaultState, DefaultState} from '../default-state';
import {createEntityAdapter, EntityState} from '@ngrx/entity';
import {Message} from './messages-models';
import {createReducer, on} from '@ngrx/store';
import {MessagesActions} from './messages-actions';

export interface MessagesState extends DefaultState, EntityState<Message> {}

export const messagesAdapter = createEntityAdapter<Message>({
  selectId: message => message.id,
  sortComparer: (a, b) => a.timestamp - b.timestamp,
});
export const initialMessageState: MessagesState = messagesAdapter.getInitialState({
  ...defaultState
});

export const messagesReducer = createReducer(
  initialMessageState,
  on(MessagesActions.loadNextMessagesBatchForOpenedChat, state => ({...state, loading: true, loaded: false, state: null})),
  on(MessagesActions.loadMessagesSuccess, (state, {messages}) =>
    messagesAdapter.addMany(messages, {
      ...state,
      loading: false,
      loaded: true,
    })
  ),
  on(MessagesActions.newMessage, (state, {message}) => messagesAdapter.addOne(message, state))
)
