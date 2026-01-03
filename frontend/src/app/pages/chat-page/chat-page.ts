import {Component, DestroyRef, inject, OnInit, ViewChild} from '@angular/core';
import {
  CdkFixedSizeVirtualScroll,
  CdkVirtualForOf,
  CdkVirtualScrollViewport,
  ScrollingModule
} from '@angular/cdk/scrolling';
import {Store} from '@ngrx/store';
import {auditTime, combineLatest, filter, map, Subscription, switchMap, take, withLatestFrom} from 'rxjs';
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

  private scrollSubscription: Subscription | null = null;
  private isNotAutoScroll = false;
  private selectedChatID: string;

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
        setTimeout(() => {
          if (!this.messagesViewport) return;

          // load more messages if needed on scroll event
          if (!this.scrollSubscription) {
            this.scrollSubscription = this.messagesViewport.scrolledIndexChange
              .pipe(
                takeUntilDestroyed(this.destroyRef),
                auditTime(100),
                switchMap((index: number) => this.store
                  .select(MessagesSelectors.calculatePreviousMessagesForOpenedChat(index))
                  .pipe(map(remaining => ({index, remaining})))
                ),
                withLatestFrom(
                  this.endReached$,
                  this.messagesLoading$,
                  this.chatSelected$
                )
              ).subscribe(([{index, remaining}, endReached, messagesLoading, chatSelected]) => {
                const requiredCount = this.calculateMessagesPerPage();
                if (remaining < requiredCount && !endReached && !messagesLoading && this.isNotAutoScroll && chatSelected) {
                  this.store.dispatch(MessagesActions.loadNextMessagesBatchForOpenedChat());
                }
                if (index > 0) {
                  this.isNotAutoScroll = true;
                }
              })
          }

          // load more messages if needed to fill the page
          if (chatSelected && !endReached && !messageLoading) {
            const requiredCount = this.calculateMessagesPerPage();
            if (messages.length < requiredCount) {
              this.store.dispatch(MessagesActions.loadNextMessagesBatchForOpenedChat());
            }
          }
        })
      });

    // autoscroll to end on page filling
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

    // chat open and close event handling
    this.selectedChat$.pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(chat => {
      if (chat) {
        setTimeout(() => {
          this.selectedChatID = chat.id;
          if (chat.scrollOffset > 0) {
            this.messagesViewport?.scrollToOffset(chat!.scrollOffset);
          }
        })
      } else {
        const scrollOffset = Math.floor(this.messagesViewport?.measureScrollOffset() ?? 0);
        this.store.dispatch(ChatActions.setScrollOffset({
          chatID: this.selectedChatID,
          scrollOffset: scrollOffset
        }));
        this.scrollSubscription?.unsubscribe();
        this.scrollSubscription = null;
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
