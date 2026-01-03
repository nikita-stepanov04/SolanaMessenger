import {Component, DestroyRef, inject, Input, OnInit} from '@angular/core';
import {Chat} from '../../../state/chats/chats-models';
import {Store} from '@ngrx/store';
import {ChatsSelectors} from '../../../state/chats/chats-selectors';
import {map} from 'rxjs';
import {AsyncPipe} from '@angular/common';
import {getInitial, stringToColor} from '../../../helpers/format';
import {ChatActions} from '../../../state/chats/chats-actions';
import {MessagesSelectors} from '../../../state/messages/messages-selectors';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {combineLatest} from 'rxjs';

@Component({
  selector: 'app-chat-sidebar-item',
  imports: [AsyncPipe],
  templateUrl: './chat-sidebar-item.html',
  styles: ``,
})
export class ChatSidebarItem implements OnInit {
  @Input() chat: Chat;

  private store = inject(Store);
  private destroyRef = inject(DestroyRef);

  private isDisabled = false;

  protected isSelected$ = this.store.select(ChatsSelectors.openedChat).pipe(
    map(chat => chat?.id === this.chat.id)
  );

  ngOnInit(): void {
    combineLatest([
      this.isSelected$,
      this.store.select(MessagesSelectors.loading)
    ]).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((([isSelected, loading]) => this.isDisabled = isSelected || loading));
  }

  onClick()  {
    if (this.isDisabled) return;
    this.store.dispatch(ChatActions.closeChat());
    setTimeout(() => this.store.dispatch(ChatActions.openChat({ chatID: this.chat.id })));
  }

  protected readonly getInitial = getInitial;
  protected readonly stringToColor = stringToColor;
}
