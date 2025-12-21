import {defaultState, DefaultState} from '../default-state';
import {Chat} from './chats.models';
import {createReducer, on} from '@ngrx/store';
import {addChatSuccess, loadChats, loadChatsFailure, loadChatsSuccess} from './chats.actions';
import {createEntityAdapter, EntityState} from '@ngrx/entity';

export interface ChatsState extends DefaultState, EntityState<Chat> {}
export const chatsAdapter = createEntityAdapter<Chat>({ selectId: chat => chat.id });
export const initialChatsState: ChatsState = chatsAdapter.getInitialState(defaultState);

export const chatsReducer = createReducer(
  initialChatsState,
  on(loadChats, state => ({ ...state, loading: true, loaded: false, error: null })),
  on(loadChatsSuccess, (state, {chats}) => chatsAdapter.setAll(chats, { ...state, loading: false, loaded: true, error: null }),),
  on(loadChatsFailure, (state, {error}) => ({ ...state, loading: false, loaded: false, error: error})),

  on(addChatSuccess, (state, {chat}) => chatsAdapter.addOne(chat, state))
)
