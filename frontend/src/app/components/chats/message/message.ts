import {Component, inject, Input, OnInit} from '@angular/core';
import {Chat, ChatUsersData} from '../../../state/chats/chats-models';
import {Message} from '../../../state/messages/messages-models';
import { getInitial, stringToColor } from "app/helpers/format";
import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';
import {ResourcesSelectors} from '../../../state/resources/resources-selectors';
import {AsyncPipe, NgClass} from '@angular/common';
import {AuthSelectors} from '../../../state/auth/auth.selectors';
import {DefaultTooltip} from '../../tooltip/default-tooltip';
import {MessagesSelectors} from '../../../state/messages/messages-selectors';

@Component({
  selector: 'app-message',
  imports: [
    AsyncPipe,
    NgClass,
    DefaultTooltip
  ],
  templateUrl: './message.html',
  styles: ``,
})
export class MessageComponent implements OnInit{
  @Input() chat: Chat;
  @Input() message: Message;

  private store = inject(Store);
  protected user: ChatUsersData;
  previousMessage$: Observable<Message>;

  protected personName$: Observable<string>;
  protected shortenPersonName$: Observable<string>;
  protected messageTime$: Observable<string>;

  protected isPreviousMessageFromTheSameSender: boolean = false;
  protected isOutgoingMessage: boolean = false;

  ngOnInit(): void {
    this.user = this.chat.usersData!.find(u => u.id === this.message.userID)!;
    this.personName$ = this.store.select(ResourcesSelectors.formatPersonName(this.user, false));
    this.shortenPersonName$ = this.store.select(ResourcesSelectors.formatPersonName(this.user, true));
    this.messageTime$ = this.store.select(ResourcesSelectors.formatTime(this.message.timestamp));
    this.store.select(MessagesSelectors.openedChatPreviousMessage(this.message.id)).subscribe(previous =>
      this.isPreviousMessageFromTheSameSender = this.message.userID == previous?.userID
    );
    this.store.select(AuthSelectors.userInfo).subscribe(userInfo => {
      this.isOutgoingMessage = userInfo!.id === this.message.userID;
    });
  }

  protected readonly getInitial = getInitial;
  protected readonly stringToColor = stringToColor;
}

