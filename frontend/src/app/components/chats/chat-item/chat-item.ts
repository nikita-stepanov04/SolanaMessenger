import {Component, Input} from '@angular/core';
import {Chat} from '../../../state/chats/chats-models';
import {DefaultTooltip} from '../../tooltip/default-tooltip';

@Component({
  selector: 'app-chat-item',
  imports: [],
  templateUrl: './chat-item.html',
  styles: ``,
})
export class ChatItem {
  @Input() chat: Chat;

  stringToColor(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = Math.floor((Math.abs(hash) % 360));
    return `hsl(${color}, 70%, 50%)`; // приятный цветовой круг
  }

  getInitial = (name: string) => name.charAt(0).toUpperCase();
}
