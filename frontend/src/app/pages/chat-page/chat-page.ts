import {Component, inject} from '@angular/core';
import {MainTemplate} from '../../templates/main-template/main-template';
import {Store} from '@ngrx/store';
import {AsyncPipe} from '@angular/common';
import {CdkFixedSizeVirtualScroll, CdkVirtualForOf, ScrollingModule} from '@angular/cdk/scrolling';
import {ChatItem} from '../../components/chats/chat-item/chat-item';
import {SearchInput} from '../../components/inputs/search-input/search-input';
import {TranslatePipe} from '@ngx-translate/core';
import {ChatsSelectors} from '../../state/chats/chats-selectors';
import {ChatActions} from '../../state/chats/chats-actions';
import {ChatHeader} from '../../components/chats/chat-header/chat-header';
import {ChatMessageInput} from '../../components/chats/chat-message-input/chat-message-input';
import {trackByID} from '../../helpers/tracking';
import {MessageComponent} from '../../components/chats/message/message';
import {MessagesActions} from '../../state/messages/messages-actions';
import {MessagesSelectors} from '../../state/messages/messages-selectors';
import {Spinner} from '../../components/spinner/spinner';

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
  templateUrl: './chat-page.html',
  styles: ``,
})
export class ChatPage{
  private chatID: string = '';
  private store = inject(Store);

  protected chats$ = this.store.select(ChatsSelectors.allByName);
  protected chatsLoaded$ = this.store.select(ChatsSelectors.loaded);
  protected chatsLoading$ = this.store.select(ChatsSelectors.loading);
  protected chatSelected$ = this.store.select(ChatsSelectors.isChatOpened);
  protected selectedChat$ = this.store.select(ChatsSelectors.openedChat);

  protected messages$ = this.store.select(MessagesSelectors.messages);
  protected messagesLoaded$ = this.store.select(MessagesSelectors.loaded);
  protected messagesLoading$ = this.store.select(MessagesSelectors.loading);

  onSearch(search: string) {
    this.store.dispatch(ChatActions.setChatsSearch({search: search}));
  }

  onChatOpen(chatID: string) {
    this.chatID = chatID;
    this.store.dispatch(ChatActions.closeChat());
    this.store.dispatch(ChatActions.openChat({chatID: chatID}));
    this.store.dispatch(MessagesActions.loadMessages({chatID: chatID, lastMessageTimestamp: 0}));
  }

  protected readonly trackByID = trackByID;
}
