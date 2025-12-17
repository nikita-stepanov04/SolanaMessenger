import {Component} from '@angular/core';
import {CheckBase} from '../check-base';
import {ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-default-check',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './default-check.html',
  styles: ``,
})
export class DefaultCheck extends CheckBase{}
