import {Component, signal} from '@angular/core';
import {AuthTemplate} from '../../templates/auth/auth-template';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../state/auth/auth-service';
import {TranslatePipe} from '@ngx-translate/core';
import {LoginInput} from '../../components/inputs/login-input/login-input';
import {PasswordInput} from '../../components/inputs/password-input/password-input';
import {passwordMismatchValidator} from '../../validators/password-mismatch';
import {TextInput} from '../../components/inputs/text-input/text-input';
import {DefaultButton} from '../../components/buttons/default-button/default-button';
import {RedirectLink} from '../../components/links/router-link/router-link';
import {RoutePath} from '../../app.routes';
import {UserRegisterInfo} from '../../state/auth/models/req/userRegisterInfo';
import {Roles} from '@models/enums/roles';
import {CryptographyService} from '../../services/cryptography-service';
import {DefaultCheck} from '../../components/checks/default-check/default-check';
import {Observable, of} from 'rxjs';
import {Store} from '@ngrx/store';
import {AuthSelectors} from '../../state/auth/auth.selectors';
import {AuthActions} from '../../state/auth/auth-actions';

@Component({
  selector: 'app-register-page',
  imports: [
    AuthTemplate,
    ReactiveFormsModule,
    TranslatePipe,
    LoginInput,
    PasswordInput,
    TextInput,
    DefaultButton,
    RedirectLink,
    DefaultCheck
  ],
  templateUrl: './register-page.html',
  styles: ``,
})
export class RegisterPage {
  registerForm: FormGroup;
  loading$: Observable<boolean>;
  isAdmin$ = signal(false);

  constructor(
    private  fb: FormBuilder,
    private authService: AuthService,
    private cryptography: CryptographyService,
    private store: Store,
  ) {
    this.registerForm = this.fb.group({
      login: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(50)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(50)]],
      passwordCopy: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(50)]],
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      surname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      patronymic: ['', [Validators.minLength(3), Validators.maxLength(50)]],
      role: [''],
      adminPassword: ['']
    }, {
      validators: passwordMismatchValidator
    });

    this.loading$ = store.select(AuthSelectors.loading);
  }

  onLoginBlur() {
    const login = this.registerForm.value.login;
    this.authService
      .checkLoginAvailability(login)
      .subscribe(res => {
        const loginControl = this.registerForm.get('login')!;
        if (!res) {
          loginControl.setErrors({ loginTaken: !res });
        } else {
          const errors = { ...loginControl.errors };
          delete errors['loginTaken'];
          loginControl.setErrors(Object.keys(errors).length ? errors : null);
        }
      });
  }

  onRoleChosen(val: boolean) {
    this.isAdmin$.set(val);
    const adminControl = this.registerForm.get('adminPassword')!;

    if (val) adminControl.setValidators([Validators.required, Validators.minLength(6), Validators.maxLength(50)]);
    else adminControl.clearValidators();

    adminControl.updateValueAndValidity();
  }

  onSubmit(): void {
    const fv = this.registerForm.value;
    const keyPair = this.cryptography.deriveX25519KeyPair(fv.password, fv.login);
    const pubBase64 = this.cryptography.bytesToBase64(keyPair.pub);

    console.log(this.isAdmin$());
    const regInfo = new UserRegisterInfo(
      fv.login,
      fv.password,
      this.isAdmin$() ? fv.adminPassword : null,
      pubBase64,
      fv.name,
      fv.surname,
      fv.patronymic,
      this.isAdmin$() ? Roles.Admin : Roles.User
    );
    console.log(regInfo);
    this.store.dispatch(AuthActions.register({registerInfo: regInfo}));
  }

  protected readonly RoutePath = RoutePath;
  protected readonly of = of;
}
