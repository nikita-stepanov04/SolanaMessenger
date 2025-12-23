import {Component, inject, signal} from '@angular/core';
import {MainTemplate} from '../../templates/main-template/main-template';
import {Store} from '@ngrx/store';
import {
  selectChatsByName,
  selectChatsLoaded,
  selectChatsLoading
} from '../../state/chats/chats.selectors';
import {AsyncPipe} from '@angular/common';
import {CdkFixedSizeVirtualScroll} from '@angular/cdk/scrolling';
import {ChatItem} from '../../components/chats/chat-item/chat-item';
import {SearchInput} from '../../components/inputs/search-input/search-input';
import {TranslatePipe} from '@ngx-translate/core';
import {setChatsSearch} from '../../state/chats/chats.actions';

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
  protected loaded$ = this.store.select(selectChatsLoaded);
  protected loading$ = this.store.select(selectChatsLoading);
  protected chats$ = this.store.select(selectChatsByName);

  onSearch(search: string) {
    this.store.dispatch(setChatsSearch({search: search}))
  }
}
