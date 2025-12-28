import {Component} from '@angular/core';
import {NotificationService} from '../../services/notification-service';
import {CloseButton} from '../buttons/close-button/close-button';

@Component({
  selector: 'app-notification',
  imports: [
    CloseButton
  ],
  templateUrl: './notification.html',
  styles: ``
})
export class Notification{
  constructor(public notification: NotificationService) {}
}
