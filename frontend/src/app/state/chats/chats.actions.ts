import {createAction, props} from '@ngrx/store';
import {Chat} from './chats.models';

export const loadChats = createAction('[Chats] Load');
export const loadChatsSuccess = createAction('[Chats] Load Success', props<{ chats: Chat[] }>());
export const loadChatsFailure = createAction('[Chats] Load Failure', props<{ error: any }>());

export const addChatSuccess = createAction('[Chats] Add Success', props<{ chat: Chat }>());

