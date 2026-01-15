import { Component } from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {ReactiveFormsModule} from '@angular/forms';
import {InputBase} from '../input-base';
import {TrimInputDirective} from '../trim-input-directive';

@Component({
  selector: 'app-password-input',
  imports: [
    TranslatePipe,
    ReactiveFormsModule,
    TrimInputDirective
  ],
  templateUrl: './password-input.html',
  styles: ``,
})
export class PasswordInput extends InputBase{

}
