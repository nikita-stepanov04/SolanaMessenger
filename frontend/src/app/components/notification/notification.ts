import {Component} from '@angular/core';
import {NotificationService} from '../../services/notification-service';

@Component({
  selector: 'app-notification',
  imports: [],
  templateUrl: './notification.html',
  styles: ``
})
export class Notification{
  constructor(public notification: NotificationService) {}
}
