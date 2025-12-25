import {Component, OnDestroy, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Notification} from './components/notification/notification';
import {ChatHubService} from './services/chat-hub-service';

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
