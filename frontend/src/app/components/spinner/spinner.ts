import {Component, Input} from '@angular/core';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-spinner',
  imports: [
    NgClass
  ],
  templateUrl: './spinner.html',
  styles: ``,
})
export class Spinner {
  @Input() size: number;
  @Input() class: string;
}
