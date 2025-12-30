import {Component} from '@angular/core';
import {ButtonBase} from '../button-base';
import {AsyncPipe} from '@angular/common';
import {Spinner} from '../../spinner/spinner';

@Component({
  selector: 'app-default-button',
  imports: [
    AsyncPipe,
    Spinner
  ],
  templateUrl: './default-button.html',
  styles: ``,
})
export class DefaultButton extends ButtonBase {
}
