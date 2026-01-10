import {Component, OnDestroy} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Notification} from './components/notification/notification';
import {ChatHubService} from './hubs/chat-hub-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Notification],
  templateUrl: './app.html'
})

export class App implements OnDestroy {

  constructor(
    private hub: ChatHubService) {}

  ngOnDestroy(): void {
    this.hub.disconnect();
  }
}
