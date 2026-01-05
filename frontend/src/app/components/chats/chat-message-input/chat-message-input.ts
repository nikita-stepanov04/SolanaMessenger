import {Component, ElementRef, inject, signal, ViewChild} from '@angular/core';
import {AutoResizeDirective} from './auto-resize-directive';
import {TranslatePipe} from '@ngx-translate/core';
import {FormsModule} from '@angular/forms';
import {Store} from '@ngrx/store';
import {AuthSelectors} from '../../../state/auth/auth.selectors';
import {take, withLatestFrom} from 'rxjs';
import {ChatsSelectors} from '../../../state/chats/chats-selectors';
import {MessagesActions} from '../../../state/messages/messages-actions';

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
  @ViewChild('messageInput') messageInput: ElementRef;

  protected isSendDisabled$ = signal(true);

  private store = inject(Store);

  onInput() {
    const text = this.messageInput.nativeElement.value.trim();
    this.isSendDisabled$.set(!text)
  }

  onSend() {
    this.store.select(AuthSelectors.userInfo).pipe(
      take(1),
      withLatestFrom(this.store.select(ChatsSelectors.openedChat))
    ).subscribe(([userInfo, chat]) => {
      const text = this.messageInput.nativeElement.value.trim();
      const message = {
        id: crypto.randomUUID(),
        text: text,
        userID: userInfo!.id,
        chatID: chat!.id,
        timestamp: Date.now(),
        isPending: true,
        ciphertext: '',
        nonce: '',
        tag: ''
      }
      this.store.dispatch(MessagesActions.sendMessage({message}));
    })
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.onSend();
    }
  }
}
