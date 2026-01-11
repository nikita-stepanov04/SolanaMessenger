import {defaultState, DefaultState} from '../default-state';
import {Chat} from './chats-models';
import {createReducer, on} from '@ngrx/store';
import {createEntityAdapter, EntityState} from '@ngrx/entity';
import {ChatActions} from './chats-actions';
import {LinuxMicrosecondTimestamp} from '../../helpers/timestamp';

export interface ChatsState extends DefaultState, EntityState<Chat> {
  searchName: string;
  selectedChatID: string;
  chatInfoLoading: boolean;
  chatInfoLoaded: boolean;
  chatInfoError: any;
}
export const chatsAdapter = createEntityAdapter<Chat>({ selectId: chat => chat.id });
export const initialChatsState: ChatsState = chatsAdapter.getInitialState({
  ...defaultState,
  searchName: '',
  selectedChatID: '',
  chatInfoLoading: false,
  chatInfoLoaded: false,
  chatInfoError: null,
});

export const chatsReducers = createReducer(
  initialChatsState,
  on(ChatActions.loadChats, state => ({ ...state, loading: true, loaded: false, error: null })),

  on(ChatActions.loadChatsSuccess, (state, {chats}) =>
    chatsAdapter.setAll(chats, {
      ...state,
      loading: false,
      loaded: true,
      error: null
    })
  ),

  on(ChatActions.loadChatsFailure, (state, {error}) => ({ ...state, loading: false, loaded: false, error: error})),

  on(ChatActions.setChatsSearch, (state, {search}) => ({ ...state, searchName: search })),
  on(ChatActions.addChatSuccess, (state, {chat}) =>
    chatsAdapter.addOne({
      ...chat,
      hasNewEvents: true,
      lastEventTimestamp: LinuxMicrosecondTimestamp.now()
    }, state)
  ),

  on(ChatActions.openChat, (state, {chatID}) =>
    chatsAdapter.updateOne({
      id: chatID,
      changes: {hasNewEvents: false},
    }, {
      ...state,
      selectedChatID: chatID,
      chatInfoLoaded: false,
      chatInfoLoading: true
    })
  ),
  on(ChatActions.closeChat, state => ({...state, selectedChatID: ''})),

  on(ChatActions.loadChatInfoSuccess, (state, { chat }) =>
    chatsAdapter.updateOne({
      id: chat.id,
      changes: chat
    }, {
      ...state,
      chatInfoLoaded: true,
      chatInfoLoading: false
    })
  ),
  on(ChatActions.loadChatInfoFailure, (state, {error}) => ({
    ...state,
    chatInfoLoading: false,
    chatInfoLoaded: false,
    chatInfoError: error
  })),

  on(ChatActions.setAllMessagesFetchedForOpenedChat, (state) =>
    chatsAdapter.updateOne({
      id: state.selectedChatID,
      changes: { areAllMessagesFetched: true }
    }, state)),

  on(ChatActions.setScrollOffset, (state, {chatID, scrollOffset}) =>
    chatsAdapter.updateOne({
      id: chatID,
      changes: { scrollOffset: scrollOffset }
    }, state)),

  on(ChatActions.newMessage, (state, {chatID}) =>
    chatsAdapter.updateOne({
      id: chatID,
      changes: {
        hasNewEvents: true,
        lastEventTimestamp: LinuxMicrosecondTimestamp.now()
      }
    }, state)),

  on(ChatActions.loadChatInfoByIdSuccess, (state, {chat}) =>
    chatsAdapter.updateOne({
      id: chat.id,
      changes: {
        timestamp: chat.timestamp,
        encryptionPayload: chat.encryptionPayload,
        usersData: chat.usersData,
        cek: chat.cek
      }
    }, state)),
)
