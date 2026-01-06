import {Component, DestroyRef, inject, Input, OnChanges} from '@angular/core';
import {Chat, ChatUsersData} from '../../../state/chats/chats-models';
import {DecryptedMessage} from '../../../state/messages/models/decrypted-message';
import {getInitial, stringToColor} from "app/helpers/format";
import {filter, Observable, take} from 'rxjs';
import {Store} from '@ngrx/store';
import {ResourcesSelectors} from '../../../state/resources/resources-selectors';
import {AsyncPipe, NgClass} from '@angular/common';
import {AuthSelectors} from '../../../state/auth/auth.selectors';
import {DefaultTooltip} from '../../tooltip/default-tooltip';
import {MessagesSelectors} from '../../../state/messages/messages-selectors';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {Spinner} from '../../spinner/spinner';

@Component({
  selector: 'app-chat-message',
  imports: [
    AsyncPipe,
    NgClass,
    DefaultTooltip,
    Spinner
  ],
  templateUrl: './chat-message.html',
  styles: ``,
})
export class ChatMessageComponent implements OnChanges {
  @Input() chat: Chat;
  @Input() message: DecryptedMessage;

  private store = inject(Store);
  private destroyRef = inject(DestroyRef);

  protected personName$: Observable<string>;
  protected shortenPersonName$: Observable<string>;
  protected messageTime$: Observable<string>;
  protected isPending$: Observable<boolean>;

  protected isPreviousMessageFromTheSameSender = false;
  protected isOutgoingMessage = false;
  protected user: ChatUsersData;

  ngOnChanges(): void {
    this.user = this.chat.usersData!.find(u => u.id === this.message.userID)!;
    this.personName$ = this.store.select(ResourcesSelectors.formatPersonName(this.user, false));
    this.shortenPersonName$ = this.store.select(ResourcesSelectors.formatPersonName(this.user, true));
    this.messageTime$ = this.store.select(ResourcesSelectors.formatTime(this.message.timestamp));

    this.store.select(MessagesSelectors.previousMessage(this.message.id, this.chat.id))
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter(Boolean))
      .subscribe(previous => {
        this.isPreviousMessageFromTheSameSender = this.message.userID === previous?.userID;
      });

    this.isPending$ = this.store.select(MessagesSelectors.isPending(this.message.id));

    this.store.select(AuthSelectors.userInfo)
      .pipe(take(1))
      .subscribe(userInfo => {
        this.isOutgoingMessage = userInfo?.id === this.message.userID;
      });
  }

  protected readonly getInitial = getInitial;
  protected readonly stringToColor = stringToColor;
}

