import { Component } from '@angular/core';
import {Notification} from '../../components/notification/notification';
import {NotificationService} from '../../services/notification-service';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-home-page',
  imports: [
    Notification
  ],
  templateUrl: './home-page.html',
  styles: ``,
})
export class HomePage {
  constructor(
    private notification: NotificationService,
    private http: HttpClient) {  }


}
