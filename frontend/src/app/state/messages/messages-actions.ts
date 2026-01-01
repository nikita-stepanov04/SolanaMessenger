import {createAction, props} from '@ngrx/store';
import {Message} from './messages-models';

export const MessagesActions = {
  loadNextMessagesBatchForOpenedChat: createAction('[Messages] Load Messages'),
  loadMessagesSuccess: createAction('[Messages] Load Messages Success', props<{messages: Message[]}>()),
  loadMessagesFailure: createAction('[Messages] Load Messages Failure', props<{error: any}>()),

  newMessage: createAction('[Messages] New Message', props<{message: Message}>()),
}
