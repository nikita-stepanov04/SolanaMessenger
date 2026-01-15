import {Component, ElementRef, inject, signal, ViewChild} from '@angular/core';
import {AutoResizeDirective} from './auto-resize-directive';
import {TranslatePipe} from '@ngx-translate/core';
import {FormsModule} from '@angular/forms';
import {Store} from '@ngrx/store';
import {AuthSelectors} from '../../../state/auth/auth.selectors';
import {take, withLatestFrom} from 'rxjs';
import {ChatsSelectors} from '../../../state/chats/chats-selectors';
import {MessagesActions} from '../../../state/messages/messages-actions';
import {LinuxMicrosecondTimestamp} from '../../../helpers/timestamp';

const MAX_MESSAGE_LENGTH = 2000;

@Component({
  selector: 'app-chat-message-input',
  imports: [
    AutoResizeDirective,
    TranslatePipe,
    FormsModule
  ],
  templateUrl: './chat-message-input.html',
  styles: ``,
})
export class ChatMessageInput {
  @ViewChild('messageInput') messageInput: ElementRef<HTMLInputElement>;

  protected isSendDisabled$ = signal(true);
  protected writingMessage$ = signal(false);
  protected messageLength$ = signal<number>(0);

  private store = inject(Store);

  onInput() {
    const text = this.messageInput.nativeElement.value.trim();
    this.messageLength$.set(text.length);
    this.isSendDisabled$.set(!text)
  }

  onSend() {
    this.store.select(AuthSelectors.userInfo).pipe(
      take(1),
      withLatestFrom(this.store.select(ChatsSelectors.openedChat))
    ).subscribe(([userInfo, chat]) => {
      const inputNative = this.messageInput.nativeElement;

      const text = inputNative.value.trim();
      inputNative.value = '';
      inputNative.dispatchEvent(new Event('input'));

      const message = {
        id: crypto.randomUUID(),
        text: text,
        userID: userInfo!.id,
        chatID: chat!.id,
        timestamp: LinuxMicrosecondTimestamp.now(),
        isPending: true,
      }
      this.store.dispatch(MessagesActions.sendMessage({message}));
    })
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (!this.isSendDisabled$())
        this.onSend();
    }
  }

  protected readonly MAX_MESSAGE_LENGTH = MAX_MESSAGE_LENGTH;
}
