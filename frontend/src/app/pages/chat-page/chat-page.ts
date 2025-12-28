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
import {Message} from '../../components/chats/message/message';

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
    Message
  ],
  templateUrl: './chat-page.html',
  styles: ``,
})
export class ChatPage{
  private store = inject(Store);
  protected loaded$ = this.store.select(ChatsSelectors.loaded);
  protected chats$ = this.store.select(ChatsSelectors.allByName);
  protected loading$ = this.store.select(ChatsSelectors.loading);
  protected chatSelected$ = this.store.select(ChatsSelectors.isChatOpened);

  onSearch(search: string) {
    this.store.dispatch(ChatActions.setChatsSearch({search: search}));
  }

  onChatOpen(chatID: string) {
    this.store.dispatch(ChatActions.closeChat());
    this.store.dispatch(ChatActions.openChat({chatID: chatID}));
  }

  protected readonly trackByID = trackByID;
}
