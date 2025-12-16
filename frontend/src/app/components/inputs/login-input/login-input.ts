import {Component, EventEmitter, Output} from '@angular/core';
import { InputBase} from '../input-base';
import {ReactiveFormsModule} from '@angular/forms';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-login-input',
  imports: [
    ReactiveFormsModule,
    TranslatePipe
  ],
  templateUrl: './login-input.html',
  styles: ``,
})
export class LoginInput extends InputBase {
  @Output() blurEvent = new EventEmitter<void>();
}
