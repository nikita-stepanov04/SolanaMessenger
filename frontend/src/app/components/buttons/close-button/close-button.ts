import {Component, Input} from '@angular/core';
import {ButtonBase} from '../button-base';
import {AsyncPipe, NgClass} from '@angular/common';

@Component({
  selector: 'app-close-button',
  imports: [
    NgClass,
    AsyncPipe
  ],
  templateUrl: './close-button.html',
  styles: ``,
})
export class CloseButton extends ButtonBase {
  @Input() class: string;
}
