import { Component } from '@angular/core';
import { InputBase} from '../input-base';
import {ReactiveFormsModule} from '@angular/forms';
import {AsyncPipe} from '@angular/common';
import {ResourcesPipe} from '../../../pipes/resources-pipe';

@Component({
  selector: 'app-login-input',
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
    ResourcesPipe
  ],
  templateUrl: './login-input.html',
  styles: ``,
})
export class LoginInput extends InputBase {

}
