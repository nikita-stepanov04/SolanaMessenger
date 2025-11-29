import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {LoginInput} from '../../components/inputs/login-input/login-input';
import {AuthTemplate} from '../../templates/auth/auth-template';
import {TranslatePipe} from '@ngx-translate/core';
import {PasswordInput} from '../../components/inputs/password-input/password-input';

@Component({
  selector: 'app-login-page',
  imports: [
    ReactiveFormsModule,
    LoginInput,
    AuthTemplate,
    TranslatePipe,
    PasswordInput,
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
      login: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(50)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(50)]],
    });
  }

  onSubmit(): void {

  }
}
