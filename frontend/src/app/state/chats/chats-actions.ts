import {createAction, props} from '@ngrx/store';
import {Chat} from './chats-models';

export const ChatActions = {
  loadChats: createAction('[Chats] Load'),
  loadChatsSuccess: createAction('[Chats] Load Success', props<{ chats: Chat[] }>()),
  loadChatsFailure: createAction('[Chats] Load Failure', props<{ error: any }>()),

  setChatsSearch: createAction('[Chats] Set Search', props<{ search: string }>()),
  addChatSuccess: createAction('[Chats] Add Success', props<{ chat: Chat }>()),
}

