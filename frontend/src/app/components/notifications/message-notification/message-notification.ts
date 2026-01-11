import {Component, inject} from '@angular/core';
import {NotificationService} from '../../../services/notification-service';
import {getInitial, stringToColor} from '../../../helpers/format';
import {Store} from '@ngrx/store';
import {ChatActions} from '../../../state/chats/chats-actions';
import {MessageForNotification} from '../../../state/messages/models/message-for-notification';

@Component({
  selector: 'app-message-notification',
  imports: [],
  templateUrl: './message-notification.html',
  styles: ``,
})
export class MessageNotification {
  private store = inject(Store);
  protected notification = inject(NotificationService);

  openChat(message: MessageForNotification): void {
    this.store.dispatch(ChatActions.closeChat());
    setTimeout(() => {
      this.store.dispatch(ChatActions.openChat({ chatID: message.chatID }));
      this.notification.clearMessage(message.id);
    });
  }

  protected readonly stringToColor = stringToColor;
  protected readonly getInitial = getInitial;
}
