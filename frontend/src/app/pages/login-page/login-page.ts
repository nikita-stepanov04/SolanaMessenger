import {Component} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {LoginInput} from '../../components/inputs/login-input/login-input';
import {FormTemplate} from '../../templates/form-template/form-template';
import {TranslatePipe} from '@ngx-translate/core';
import {PasswordInput} from '../../components/inputs/password-input/password-input';
import {UserLoginInfo} from '../../state/auth/models/req/userLoginInfo';
import {DefaultButton} from '../../components/buttons/default-button/default-button';
import {RedirectLink} from '../../components/links/router-link/router-link';
import {RoutePath} from '../../app.routes';
import {Observable, of} from 'rxjs';
import {Store} from '@ngrx/store';
import {AuthSelectors} from '../../state/auth/auth.selectors';
import {AuthActions} from '../../state/auth/auth-actions';

@Component({
  selector: 'app-login-page',
  imports: [
    ReactiveFormsModule,
    LoginInput,
    FormTemplate,
    TranslatePipe,
    PasswordInput,
    DefaultButton,
    RedirectLink,
  ],
  templateUrl: './login-page.html',
  styles: ``,
})
export class LoginPage {
  readonly RoutePath = RoutePath;
  loginForm: FormGroup;
  loading$: Observable<boolean>;

  constructor(
    private fb: FormBuilder,
    private store: Store,
  ) {
    this.loginForm = this.fb.group({
      login: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(50)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(50)]],
    });
    this.loading$ = store.select(AuthSelectors.loading);
  }

  onSubmit(): void {
    const fv = this.loginForm.value;
    this.store.dispatch(AuthActions.login({
      loginInfo: new UserLoginInfo(fv.login, fv.password)
    }));
  }

  protected readonly of = of;
}
