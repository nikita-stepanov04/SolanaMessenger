import {createAction, props} from '@ngrx/store';
import {Message} from './models/message';

export const MessagesActions = {
  loadNextMessagesBatchForOpenedChat: createAction('[Messages] Load Messages'),
  loadMessagesSuccess: createAction('[Messages] Load Messages Success', props<{messages: Message[]}>()),
  loadMessagesFailure: createAction('[Messages] Load Messages Failure', props<{error: any}>()),

  newMessage: createAction('[Messages] New Message', props<{message: Message}>()),

  sendMessage: createAction('[Messages] SendMessage', props<{message: Message}>()),
  sendMessageSuccess: createAction('[Messages] SendMessageSuccess', props<{messageID: string}>()),
  sendMessageFailure: createAction('[Messages] SendMessageFailure', props<{messageID: string, error: any}>()),
}
