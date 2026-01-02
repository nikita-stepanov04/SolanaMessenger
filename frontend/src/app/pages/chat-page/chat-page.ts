import {Component, DestroyRef, inject, OnInit, ViewChild} from '@angular/core';
import {
  CdkFixedSizeVirtualScroll,
  CdkVirtualForOf,
  CdkVirtualScrollViewport,
  ScrollingModule
} from '@angular/cdk/scrolling';
import {Store} from '@ngrx/store';
import {auditTime, combineLatest, filter, map, switchMap, take, withLatestFrom} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {MessagesActions} from '../../state/messages/messages-actions';
import {MessagesSelectors} from '../../state/messages/messages-selectors';
import {ChatActions} from '../../state/chats/chats-actions';
import {trackByID} from '../../helpers/tracking';
import {MainTemplate} from '../../templates/main-template/main-template';
import {AsyncPipe} from '@angular/common';
import {ChatSidebarItem} from '../../components/chats/chat-sidebar-item/chat-sidebar-item';
import {SearchInput} from '../../components/inputs/search-input/search-input';
import {TranslatePipe} from '@ngx-translate/core';
import {ChatHeader} from '../../components/chats/chat-header/chat-header';
import {ChatMessageInput} from '../../components/chats/chat-message-input/chat-message-input';
import {MessageComponent} from '../../components/chats/message/message';
import {Spinner} from '../../components/spinner/spinner';
import {ChatsSelectors} from '../../state/chats/chats-selectors';

@Component({
  selector: 'app-chat-page',
  imports: [
    MainTemplate,
    AsyncPipe,
    CdkFixedSizeVirtualScroll,
    ChatSidebarItem,
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
export class ChatPage implements OnInit {
  private store = inject(Store);
  private destroyRef = inject(DestroyRef);

  readonly MESSAGE_ITEM_SIZE = 30;


  protected chats$ = this.store.select(ChatsSelectors.allByName);
  protected chatsLoaded$ = this.store.select(ChatsSelectors.loaded);
  protected chatsLoading$ = this.store.select(ChatsSelectors.loading);
  protected chatSelected$ = this.store.select(ChatsSelectors.isChatOpened);
  protected selectedChat$ = this.store.select(ChatsSelectors.openedChat);

  protected messages$ = this.store.select(MessagesSelectors.openedChatMessages);
  protected messagesLoaded$ = this.store.select(MessagesSelectors.loaded);
  protected messagesLoading$ = this.store.select(MessagesSelectors.loading);
  protected endReached$ = this.store.select(ChatsSelectors.areAllMessagesFetchedForOpenedChat);

  private subscribedToScroll = false;
  private isNotAutoScroll = false;

  @ViewChild('messagesViewport')
  messagesViewport?: CdkVirtualScrollViewport;

  ngOnInit() {
    combineLatest([
      this.chatSelected$,
      this.messages$,
      this.endReached$,
      this.messagesLoading$
    ]).pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([chatSelected, messages, endReached, messageLoading]) => {
        if (!this.messagesViewport) return;

        // load more messages if needed on scroll event
        if (!this.subscribedToScroll) {
          this.messagesViewport.scrolledIndexChange
            .pipe(
              takeUntilDestroyed(this.destroyRef),
              auditTime(100),
              switchMap((index: number) => this.store.select(MessagesSelectors.calculatePreviousMessagesForOpenedChat(index)).pipe(
                map(remaining => ({index, remaining}))
              )),
              withLatestFrom(
                this.endReached$,
                this.messagesLoading$
              )
            ).subscribe(([{index, remaining}, endReached, messagesLoading]) => {
              const requiredCount = this.calculateMessagesPerPage();
              if (remaining < requiredCount && !endReached && !messagesLoading && this.isNotAutoScroll) {
                console.log('dispatch from scroll')
                this.store.dispatch(MessagesActions.loadNextMessagesBatchForOpenedChat());
              }
              if (index > 0) {
                this.isNotAutoScroll = true;
              }
            })
          this.subscribedToScroll = true;
        }

        // load more messages if needed to fill the page
        if (chatSelected && !endReached && !messageLoading) {
          const requiredCount = this.calculateMessagesPerPage();
          if (messages.length < requiredCount) {
            console.log('dispatch from page fill')
            this.store.dispatch(MessagesActions.loadNextMessagesBatchForOpenedChat());
          }
        }
      });

    combineLatest([
      this.messages$,
      this.messagesLoaded$
    ]).pipe(
      takeUntilDestroyed(this.destroyRef),
      filter(() => !this.isNotAutoScroll)
    ).subscribe(([messages, loaded]) => {
      if (loaded) {
        this.messagesViewport?.renderedRangeStream
          .pipe(take(1))
          .subscribe(() => {
            setTimeout(() => this.messagesViewport!.scrollToIndex(messages.length - 1));
          });
      }
    });
  }

  onSearch(search: string) {
    this.store.dispatch(ChatActions.setChatsSearch({ search }));
  }

  private calculateMessagesPerPage(): number {
    const viewportHeight = this.messagesViewport!.getViewportSize();
    const visibleItems = Math.floor(viewportHeight / this.MESSAGE_ITEM_SIZE);
    return visibleItems * 2;
  }

  protected readonly trackByID = trackByID;
}
