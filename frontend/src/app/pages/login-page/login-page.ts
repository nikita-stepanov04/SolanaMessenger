import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {LoginInput} from '../../components/inputs/login-input/login-input';
import {AuthTemplate} from '../../templates/auth/auth-template';
import {ResourcesPipe} from '../../pipes/resources-pipe';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-login-page',
  imports: [
    ReactiveFormsModule,
    LoginInput,
    AuthTemplate,
    ResourcesPipe,
    AsyncPipe,
  ],
  templateUrl: './login-page.html',
  styles: ``,
})
export class LoginPage {
  loginForm: FormGroup;

  constructor(
    private  fb: FormBuilder
  ) {
    this.loginForm = this.fb.group({
      login: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(32)]],
    });
  }

  onSubmit(): void {

  }
}
