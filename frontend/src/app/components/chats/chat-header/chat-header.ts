import {Component, inject} from '@angular/core';
import {CloseButton} from '../../buttons/close-button/close-button';
import {Store} from '@ngrx/store';
import {ChatActions} from '../../../state/chats/chats-actions';
import {ChatsSelectors} from '../../../state/chats/chats-selectors';
import {AsyncPipe} from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';
import {filter, switchMap, withLatestFrom} from 'rxjs';
import {ResourcesSelectors} from '../../../state/resources/resources-selectors';

@Component({
  selector: 'app-chat-header',
  imports: [
    CloseButton,
    AsyncPipe,
    TranslatePipe
  ],
  templateUrl: './chat-header.html',
  styles: ``,
})
export class ChatHeader {
  private store = inject(Store);
  protected chat$ = this.store.select(ChatsSelectors.openedChat);
  protected chatInfoLoaded$ = this.store.select(ChatsSelectors.chatInfoLoaded);
  protected chatInfoLoading$ = this.store.select(ChatsSelectors.chatInfoLoading);
  protected createdAt$ = this.chatInfoLoaded$.pipe(
    filter(loaded => loaded),
    withLatestFrom(this.chat$),
    switchMap(([_, chat]) => this.store.select(ResourcesSelectors.formatDate(chat!.timestamp)))
  )

  closeChat() {
    this.store.dispatch(ChatActions.closeChat());
  }
}
