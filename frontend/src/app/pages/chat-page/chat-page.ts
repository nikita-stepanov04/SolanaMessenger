import {Component, ViewChild, inject, DestroyRef, AfterViewInit, NgZone} from '@angular/core';
import {
  CdkFixedSizeVirtualScroll,
  CdkVirtualForOf,
  CdkVirtualScrollViewport,
  ScrollingModule
} from '@angular/cdk/scrolling';
import { Store } from '@ngrx/store';
import {combineLatest, take} from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MessagesActions } from '../../state/messages/messages-actions';
import { MessagesSelectors } from '../../state/messages/messages-selectors';
import { ChatActions } from '../../state/chats/chats-actions';
import { trackByID } from '../../helpers/tracking';
import { MainTemplate } from '../../templates/main-template/main-template';
import { AsyncPipe } from '@angular/common';
import { ChatItem } from '../../components/chats/chat-item/chat-item';
import { SearchInput } from '../../components/inputs/search-input/search-input';
import { TranslatePipe } from '@ngx-translate/core';
import { ChatHeader } from '../../components/chats/chat-header/chat-header';
import { ChatMessageInput } from '../../components/chats/chat-message-input/chat-message-input';
import { MessageComponent } from '../../components/chats/message/message';
import { Spinner } from '../../components/spinner/spinner';
import { ChatsSelectors } from '../../state/chats/chats-selectors';

@Component({
  selector: 'app-chat-page',
  imports: [
    MainTemplate,
    AsyncPipe,
    CdkFixedSizeVirtualScroll,
    ChatItem,
    SearchInput,
    TranslatePipe,
    ChatHeader,
    ChatMessageInput,
    CdkVirtualForOf,
    ScrollingModule,
    MessageComponent,
    Spinner,
  ],
  standalone: true,
  templateUrl: './chat-page.html',
})
export class ChatPage implements AfterViewInit {
  private store = inject(Store);
  private destroyRef = inject(DestroyRef);

  readonly MESSAGE_ITEM_SIZE = 30;

  protected chats$ = this.store.select(ChatsSelectors.allByName);
  protected chatsLoaded$ = this.store.select(ChatsSelectors.loaded);
  protected chatsLoading$ = this.store.select(ChatsSelectors.loading);
  protected chatSelected$ = this.store.select(ChatsSelectors.isChatOpened);
  protected selectedChat$ = this.store.select(ChatsSelectors.openedChat);

  protected messages$ = this.store.select(MessagesSelectors.openedChatMessages);
  protected messagesLoading$ = this.store.select(MessagesSelectors.loading);
  protected endReached$ = this.store.select(ChatsSelectors.areAllMessagesFetchedForOpenedChat);

  @ViewChild('messagesViewport')
  messagesViewport?: CdkVirtualScrollViewport;

  ngAfterViewInit() {
    combineLatest([
      this.chatSelected$,
      this.messages$,
      this.endReached$,
      this.messagesLoading$
    ])
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter(([chatSelected, _, endReached, messageLoading]) => chatSelected && !endReached && !messageLoading),
      )
      .subscribe(([_, messages, endReached]) => {
        if (!this.messagesViewport) return;

        const viewportHeight = this.messagesViewport.getViewportSize();
        const visibleItems = Math.floor(viewportHeight / this.MESSAGE_ITEM_SIZE);
        const requiredCount = visibleItems * 2;

        if (messages.length < requiredCount) {
          this.store.dispatch(MessagesActions.loadNextMessagesBatchForOpenedChat());
        }
      });
  }

  onChatOpen(chatID: string) {
    this.store.dispatch(ChatActions.closeChat());
    this.store.dispatch(ChatActions.openChat({ chatID }));
  }

  onSearch(search: string) {
    this.store.dispatch(ChatActions.setChatsSearch({ search }));
  }

  protected readonly trackByID = trackByID;
}
