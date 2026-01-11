import {Component} from '@angular/core';
import {NotificationService} from '../../../services/notification-service';
import {CloseButton} from '../../buttons/close-button/close-button';

@Component({
  selector: 'app-standard-notification',
  imports: [
    CloseButton
  ],
  templateUrl: './standard-notification.html',
  styles: ``
})
export class StandardNotification {
  constructor(public notification: NotificationService) {}
}
