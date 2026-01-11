import {Chat} from '../state/chats/chats-models';
import {inject, Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {ChatActions} from '../state/chats/chats-actions';
import {ResourcesService} from '../state/resources/resources-service';
import {stringFormat} from '../helpers/format';
import {NotificationService} from '../services/notification-service';
import {EncryptedMessage} from '../state/messages/models/encrypted-message';
import {ChatsSelectors} from '../state/chats/chats-selectors';
import {Subscription, take, withLatestFrom} from 'rxjs';
import {CryptographyService} from '../services/cryptography-service';
import {MessagesActions} from '../state/messages/messages-actions';
import {EventName} from './chat-hub-event-decorator';
import {Actions, ofType} from '@ngrx/effects';

@Injectable({
  providedIn: 'root',
})
export class ChatHubEventHandlers {
  private store = inject(Store);
  private actions = inject(Actions);
  private crypto = inject(CryptographyService);
  private resources = inject(ResourcesService);
  private notification = inject(NotificationService);

  @EventName('userAddedToChat')
  public onAddToChat(params: {chat: Chat}) {
    const {chat} = params;

    this.store.dispatch(ChatActions.addChatSuccess({chat}));
    this.resources
      .get('str036')
      .subscribe(text => this.notification.success(stringFormat(text, chat.name)));
  }

  @EventName('receiveMessage')
  public onNewMessage(params: {message: EncryptedMessage}) {
    const {message} = params;
    let chatLoadSub: Subscription | null = null;
    let chatLoadFailureSub: Subscription | null = null;

    this.store
      .select(ChatsSelectors.chatByID(message.chatID))
      .pipe(
        take(1),
        withLatestFrom(this.store.select(ChatsSelectors.openedChat))
      ).subscribe(([chat, openedChat]) => {
        if (!chat!.encryptionPayload) {
          if (openedChat?.id != chat!.id) {
            this.store.dispatch(ChatActions.loadChatInfoById({chatID: chat!.id}));

            chatLoadSub = this.actions.pipe(
              ofType(ChatActions.loadChatInfoByIdSuccess),
            ).pipe(take(1))
              .subscribe(action => {
                chatLoadFailureSub?.unsubscribe();
                this.notifyUser(action.chat, message)
              });

            chatLoadFailureSub = this.actions.pipe(
              ofType(ChatActions.loadChatInfoByIdFailure),
            ).pipe(take(1))
              .subscribe(() => {
                chatLoadSub?.unsubscribe()
              });
          }
        }
        else {
          this.notifyUser(chat!, message);
        }
      });
  }

  private notifyUser(chat: Chat, message: EncryptedMessage) {
    const decryptedMessage = this.crypto.decryptMessage(message, chat.cek);
    this.store.dispatch(MessagesActions.newMessage({message: decryptedMessage}));
  }
}
