import {Component} from '@angular/core';
import {ButtonBase} from '../button-base';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-default-button',
  imports: [
    AsyncPipe
  ],
  templateUrl: './default-button.html',
  styles: ``,
})
export class DefaultButton extends ButtonBase {
}
