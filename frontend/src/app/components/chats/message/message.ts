import { Component } from '@angular/core';
import {getInitial, stringToColor} from '../shared';

@Component({
  selector: 'app-message',
  imports: [],
  templateUrl: './message.html',
  styles: ``,
})
export class Message {

  protected readonly getInitial = getInitial;
  protected readonly stringToColor = stringToColor;
}
