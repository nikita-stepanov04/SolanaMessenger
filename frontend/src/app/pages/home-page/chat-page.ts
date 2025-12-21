import {Component, inject, OnInit} from '@angular/core';
import {Notification} from '../../components/notification/notification';
import {NotificationService} from '../../services/notification-service';
import {HttpClient} from '@angular/common/http';
import {MainTemplate} from '../../templates/main-template/main-template';
import {Store} from '@ngrx/store';
import {selectAllChats, selectChatIds, selectChatsLoaded} from '../../state/chats/chats.selectors';
import {Observable} from 'rxjs';
import {Chat} from '../../state/chats/chats.models';
import {AsyncPipe} from '@angular/common';
import {loadChats} from '../../state/chats/chats.actions';
import {CdkFixedSizeVirtualScroll} from '@angular/cdk/scrolling';
import {ChatItem} from '../../components/chats/chat-item/chat-item';

@Component({
  selector: 'app-chat-page',
  imports: [
    MainTemplate,
    AsyncPipe,
    CdkFixedSizeVirtualScroll,
    ChatItem
  ],
  templateUrl: './chat-page.html',
  styles: ``,
})
export class ChatPage implements OnInit {
  private store = inject(Store);
  private loaded$ = this.store.select(selectChatsLoaded);
  protected chats$ = this.store.select(selectAllChats);

  ngOnInit(): void {
    this.loaded$.subscribe(loaded => {
      if (!loaded)
        this.store.dispatch(loadChats());
    })
  }
}
