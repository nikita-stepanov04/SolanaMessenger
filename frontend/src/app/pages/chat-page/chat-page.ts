import {Component, DestroyRef, inject, OnInit, ViewChild} from '@angular/core';
import {
  CdkFixedSizeVirtualScroll,
  CdkVirtualForOf,
  CdkVirtualScrollViewport,
  ScrollingModule
} from '@angular/cdk/scrolling';
import {Store} from '@ngrx/store';
import {auditTime, combineLatest, filter, Subscription, take, withLatestFrom} from 'rxjs';
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
import {ChatMessageComponent} from '../../components/chats/chat-message/chat-message';
import {Spinner} from '../../components/spinner/spinner';
import {ChatsSelectors} from '../../state/chats/chats-selectors';
import {Actions, ofType} from '@ngrx/effects';

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
    Spinner,
    ChatMessageComponent,
  ],
  standalone: true,
  templateUrl: './chat-page.html'
})
export class ChatPage implements OnInit {
  private store = inject(Store);
  private actions = inject(Actions);
  private destroyRef = inject(DestroyRef);

  readonly MESSAGE_ITEM_SIZE = 30;

  protected chats$ = this.store.select(ChatsSelectors.allByName);
  protected chatsLoaded$ = this.store.select(ChatsSelectors.loaded);
  protected chatsLoading$ = this.store.select(ChatsSelectors.loading);
  protected selectedChat$ = this.store.select(ChatsSelectors.openedChat);
  protected chatSelected$ = this.store.select(ChatsSelectors.isChatOpened);

  protected messagesLoaded$ = this.store.select(MessagesSelectors.loaded);
  protected messagesLoading$ = this.store.select(MessagesSelectors.loading);
  protected chatInfoLoaded$ = this.store.select(ChatsSelectors.chatInfoLoaded);
  protected messages$ = this.store.select(MessagesSelectors.openedChatMessages);
  protected endReached$ = this.store.select(ChatsSelectors.areAllMessagesFetchedForOpenedChat);

  private chatLoadSub: Subscription | null = null;
  private chatScrollSub: Subscription | null = null;
  private newMessageSub: Subscription | null = null;

  private selectedChatID: string = '';

  @ViewChild('messagesViewport')
  messagesViewport?: CdkVirtualScrollViewport;

  ngOnInit() {

    // Load messages if there's not enough in store
    combineLatest([
      this.selectedChat$,
      this.chatInfoLoaded$
    ]).pipe(
        auditTime(100),
        filter(([chat, chatInfoLoaded]) =>
          !!chat && !!this.messagesViewport &&
          chatInfoLoaded && !this.chatLoadSub),
        withLatestFrom(
          this.messages$,
          this.endReached$
        ),
      )
      .subscribe(([_, messages, endReached]) => {
        const required = this.requiredMessagesPerPage();
        if (messages.length < required && !endReached) {

          // First manual dispatch to trigger next sub
          this.store.dispatch(MessagesActions.loadNextMessagesBatchForOpenedChat());

          this.chatLoadSub = this.messagesViewport!.renderedRangeStream.pipe(
            takeUntilDestroyed(this.destroyRef),
            withLatestFrom(
              this.messagesLoaded$,
              this.messages$,
              this.endReached$,
            ),
            filter(([listRange, loaded]) => listRange.start < listRange.end && loaded),
            auditTime(0)
          ).subscribe(([_, __, messages, endReached]) => {
            const required = this.requiredMessagesPerPage();
            this.messagesViewport!.scrollToOffset(Number.MAX_SAFE_INTEGER);

            if (messages.length < required && !endReached)
              this.store.dispatch(MessagesActions.loadNextMessagesBatchForOpenedChat());

            // If loaded enough, subscribe for scroll event and load on scroll
            if (messages.length >= required && !endReached)
              this.subscribeForScroll();
          });
        }

        // Subscribe for scroll if there are enough messages in store for page fill
        if (messages.length >= required && !endReached)
          this.subscribeForScroll();
      });

    // Chat open/close events
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
      } else if (this.selectedChatID) {
        const scrollOffset = Math.floor(this.messagesViewport?.measureScrollOffset() ?? 0);
        this.store.dispatch(ChatActions.setScrollOffset({
          chatID: this.selectedChatID,
          scrollOffset: scrollOffset
        }));
        this.chatLoadSub?.unsubscribe();
        this.chatScrollSub?.unsubscribe();
        this.newMessageSub?.unsubscribe();
        this.chatLoadSub = null;
      }
    });

    this.newMessageSub = this.actions.pipe(
      ofType(
        MessagesActions.newMessage,
        MessagesActions.sendMessage
      )
    ).subscribe(() => {
      this.messagesViewport!.renderedRangeStream.pipe(
        take(1)
      ).subscribe(() =>
        setTimeout(() => this.messagesViewport!.scrollToOffset(Number.MAX_SAFE_INTEGER))
      );
    })
  }

  onSearch(search: string) {
    this.store.dispatch(ChatActions.setChatsSearch({ search }));
  }

  private requiredMessagesPerPage(): number {
    const viewportHeight = this.messagesViewport!.getViewportSize();
    return Math.floor(viewportHeight / this.MESSAGE_ITEM_SIZE);
  }

  private subscribeForScroll() {
    this.chatLoadSub?.unsubscribe();
    this.chatLoadSub = combineLatest([
      this.messagesViewport!.scrolledIndexChange,
      this.endReached$,
      this.messagesLoading$
    ]).subscribe(([index, endReached, messagesLoading]) => {
      if (index == 0 && !endReached && !messagesLoading) {
        setTimeout(() => this.messagesViewport!.scrollToIndex(1, 'smooth'));
        this.messagesViewport!.elementRef.nativeElement.classList.add('no-scroll');
        this.store.dispatch(MessagesActions.loadNextMessagesBatchForOpenedChat());
      }
    });

    // enable user scroll after messages batch loading end
    this.chatScrollSub = combineLatest([
      this.messagesViewport!.renderedRangeStream,
      this.messagesLoading$
    ]).subscribe(([_, loading]) => {
      const viewportNative = this.messagesViewport!.elementRef.nativeElement;
      if (!loading && viewportNative.classList.contains('no-scroll')) {
        setTimeout(() => this.messagesViewport!.elementRef.nativeElement.classList.remove('no-scroll'));
      }
    })
  }

  protected readonly trackByID = trackByID;
}
