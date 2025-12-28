import {Component, ElementRef, signal, ViewChild} from '@angular/core';
import {AutoResizeDirective} from './auto-resize-directive';
import {TranslatePipe} from '@ngx-translate/core';
import {FormsModule} from '@angular/forms';

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

  onInput() {
    const text = this.messageInput.nativeElement.value.trim();
    this.isSendDisabled$.set(!text)
  }
}
