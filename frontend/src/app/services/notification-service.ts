import {inject, Injectable, signal} from '@angular/core';
import {ResourcesService} from '../state/resources/resources-service';
import {DecryptedMessage} from '../state/messages/models/decrypted-message';
import {MessageForNotification} from '../state/messages/models/message-for-notification';
import {Store} from '@ngrx/store';
import {ChatsSelectors} from '../state/chats/chats-selectors';
import {filter, map, switchMap, take} from 'rxjs';
import {Chat} from '../state/chats/chats-models';
import {ResourcesSelectors} from '../state/resources/resources-selectors';

const SUCCESS_AUTOHIDE_TIMEOUT = 1500;
const ERROR_AUTOHIDE_TIMEOUT = 3500;
const MESSAGE_AUTOHIDE_TIMEOUT = 10000;

const ERROR_CODE_MESSAGES: Record<string, string> = {
  '400': 'str032',
  '401': 'str028',
  '500': 'str032'
};

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  public error$ = signal<string>('');
  public success$ = signal<string>('');
  public messages$ = signal<MessageForNotification[]>([]);

  private store = inject(Store);
  private resource = inject(ResourcesService);

  public newMessage(message: DecryptedMessage) {
    this.store.select(ChatsSelectors.chatByID(message.chatID)).pipe(
      take(1),
      filter((chat): chat is Chat => !!chat),
      switchMap((chat: Chat) => {
        const userInfo = chat.usersData!.find(u => u.id === message.userID)!;
        return this.store.select(ResourcesSelectors.formatPersonName(userInfo, true)).pipe(
          map(name => ({ chat, name }))
        );
      })
    ).subscribe(({ chat, name }) => {
      const notification = {
        id: message.id,
        senderName: name,
        chatID: chat.id,
        chatName: chat.name,
        text: message.text,
        timestamp: message.timestamp,
      }
      this.messages$.update(messages => [...messages, notification]);
      setTimeout(() => this.clearMessage(message.id), MESSAGE_AUTOHIDE_TIMEOUT)
    });
  }

  public success(msg: string): void {
    this.update(msg, true);
  }

  public error(err: any): void {
    const message = err?.error?.message;
    const status = err?.status;

    if (message) {
      this.update(message, false);
    }
    else if (status) {
      const statusTextCode = ERROR_CODE_MESSAGES[status];
      if (!statusTextCode){
        this.update(`Error ${status}`, false);
        return;
      }
      this.resource
        .get(statusTextCode)
        .subscribe(text => this.update(text, false));
    }
    else {
      this.update(err, false)
    }
  }

  public clearError() {
    this.update('', false)
  }

  public clearSuccess() {
    this.update('', true);
  }

  public clearMessage(messageID: string) {
    this.messages$.update(messages => [...messages.filter(m => m.id !== messageID)]);
  }

  private update(msg: string, success: boolean): void {
    const channel = success ? this.success$ : this.error$;
    channel.set(msg);
    if (msg) {
      setTimeout(() => channel.set(''),
        success ? SUCCESS_AUTOHIDE_TIMEOUT : ERROR_AUTOHIDE_TIMEOUT);
    }
  }
}
