import {defaultState, DefaultState} from '../default-state';
import {Chat} from './chats-models';
import {createReducer, on} from '@ngrx/store';
import {createEntityAdapter, EntityState} from '@ngrx/entity';
import {ChatActions} from './chats-actions';

export interface ChatsState extends DefaultState, EntityState<Chat> {
  searchName: string;
}
export const chatsAdapter = createEntityAdapter<Chat>({ selectId: chat => chat.id });
export const initialChatsState: ChatsState = chatsAdapter.getInitialState({
  ...defaultState,
  searchName: ''
});

export const chatsReducers = createReducer(
  initialChatsState,
  on(ChatActions.loadChats, state => ({ ...state, loading: true, loaded: false, error: null })),
  on(ChatActions.loadChatsSuccess, (state, {chats}) => chatsAdapter.setAll(chats, { ...state, loading: false, loaded: true, error: null }),),
  on(ChatActions.loadChatsFailure, (state, {error}) => ({ ...state, loading: false, loaded: false, error: error})),

  on(ChatActions.setChatsSearch, (state, {search}) => ({ ...state, searchName: search })),
  on(ChatActions.addChatSuccess, (state, {chat}) =>
    chatsAdapter.addOne({
      ...chat,
      lastVisited: Date.now(),
      isNew: true
    }, state)
  )
)
