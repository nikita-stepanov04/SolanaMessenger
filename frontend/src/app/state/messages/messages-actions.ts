import {createAction, props} from '@ngrx/store';
import {DecryptedMessage} from './models/decrypted-message';

export const MessagesActions = {
  loadNextMessagesBatchForOpenedChat: createAction('[Messages] Load Messages'),
  loadMessagesSuccess: createAction('[Messages] Load Messages Success', props<{messages: DecryptedMessage[]}>()),
  loadMessagesFailure: createAction('[Messages] Load Messages Failure', props<{error: any}>()),

  newMessage: createAction('[Messages] New DecryptedMessage', props<{message: DecryptedMessage}>()),

  sendMessage: createAction('[Messages] SendMessage', props<{message: DecryptedMessage}>()),
  sendMessageSuccess: createAction('[Messages] SendMessageSuccess', props<{messageID: string}>()),
  sendMessageFailure: createAction('[Messages] SendMessageFailure', props<{messageID: string, error: any}>()),
}
