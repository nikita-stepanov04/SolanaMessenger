import {createAction, props} from '@ngrx/store';
import {Chat} from './chats-models';

export const ChatActions = {
  loadChats: createAction('[Chats] Load'),
  loadChatsSuccess: createAction('[Chats] Load Success', props<{ chats: Chat[] }>()),
  loadChatsFailure: createAction('[Chats] Load Failure', props<{ error: any }>()),

  setChatsSearch: createAction('[Chats] Set Search', props<{ search: string }>()),
  addChatSuccess: createAction('[Chats] Add Success', props<{ chat: Chat }>()),

  openChat: createAction('[Chats] Open Chat', props<{ chatID: string }>()),
  closeChat: createAction('[Chats] Close Chat'),

  loadChatInfoSuccess: createAction('[Chats] Load ChatInfo Success', props<{ chat: Chat }>()),
  loadChatInfoFailure: createAction('[Chats] Load ChatInfo Failure', props<{ error: any }>()),

  setAllMessagesFetchedForOpenedChat: createAction('[Chats] All messages were fetched'),
  setLastMessageTimestampForOpenedChat: createAction('[Chats] LastMessage timestamp was set', props<{timestamp: number}>()),
  setScrollOffset: createAction('[Chats] Set scroll offset', props<{ chatID: string, scrollOffset: number }>()),

  loadChatInfoById: createAction('[Chats] Load ChatInfo ById', props<{ chatID: string }>()),
  loadChatInfoByIdSuccess: createAction('[Chats] Load ChatInfo ById Success', props<{chat: Chat}>()),
  loadChatInfoByIdFailure: createAction('[Chats] Load ChatInfo ByIdFailure', props<{ error: any }>()),

  newMessage: createAction('[Chats] New Message', props<{ chatID: string }>()),
}

