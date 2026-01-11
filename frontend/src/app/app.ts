import {Component, OnDestroy} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {StandardNotification} from './components/notifications/standard-notification/standard-notification';
import {ChatHubService} from './hubs/chat-hub-service';
import {MessageNotification} from './components/notifications/message-notification/message-notification';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, StandardNotification, MessageNotification],
  templateUrl: './app.html'
})

export class App implements OnDestroy {

  constructor(
    private hub: ChatHubService) {}

  ngOnDestroy(): void {
    this.hub.disconnect();
  }
}
