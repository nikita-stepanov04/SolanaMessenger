import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {Chat} from '../../../state/chats/chats-models';
import {Store} from '@ngrx/store';
import {ChatsSelectors} from '../../../state/chats/chats-selectors';
import {map} from 'rxjs';
import {AsyncPipe} from '@angular/common';
import {getInitial, stringToColor} from '../shared';

@Component({
  selector: 'app-chat-item',
  imports: [
    AsyncPipe
  ],
  templateUrl: './chat-item.html',
  styles: ``,
})
export class ChatItem {
  @Input() chat: Chat;
  @Output() onClickEvent = new EventEmitter<string>();

  private store = inject(Store);
  protected isSelected = this.store.select(ChatsSelectors.openedChat).pipe(
    map(chat => chat?.id === this.chat.id)
  );

  onClick()  {
    this.onClickEvent.emit(this.chat.id);
  }

  protected readonly stringToColor = stringToColor;
  protected readonly getInitial = getInitial;
}
