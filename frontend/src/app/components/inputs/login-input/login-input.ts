import {Component, EventEmitter, Output} from '@angular/core';
import { InputBase} from '../input-base';
import {ReactiveFormsModule} from '@angular/forms';
import {TranslatePipe} from '@ngx-translate/core';
import {TrimInputDirective} from '../trim-input-directive';

@Component({
  selector: 'app-login-input',
  imports: [
    ReactiveFormsModule,
    TranslatePipe,
    TrimInputDirective
  ],
  templateUrl: './login-input.html',
  styles: ``,
})
export class LoginInput extends InputBase {
  @Output() blurEvent = new EventEmitter<void>();
}
