import {Component, inject, signal} from '@angular/core';
import {MainTemplate} from '../../templates/main-template/main-template';
import {Store} from '@ngrx/store';
import {AsyncPipe} from '@angular/common';
import {CdkFixedSizeVirtualScroll} from '@angular/cdk/scrolling';
import {ChatItem} from '../../components/chats/chat-item/chat-item';
import {SearchInput} from '../../components/inputs/search-input/search-input';
import {TranslatePipe} from '@ngx-translate/core';
import {ChatsSelectors} from '../../state/chats/chats-selectors';
import {ChatActions} from '../../state/chats/chats-actions';

@Component({
  selector: 'app-chat-page',
  imports: [
    MainTemplate,
    AsyncPipe,
    CdkFixedSizeVirtualScroll,
    ChatItem,
    SearchInput,
    TranslatePipe
  ],
  templateUrl: './chat-page.html',
  styles: ``,
})
export class ChatPage{
  private store = inject(Store);
  protected chatSelected$ = signal(false);
  protected loaded$ = this.store.select(ChatsSelectors.loaded);
  protected loading$ = this.store.select(ChatsSelectors.loading);
  protected chats$ = this.store.select(ChatsSelectors.allByName);

  onSearch(search: string) {
    this.store.dispatch(ChatActions.setChatsSearch({search: search}))
  }
}
