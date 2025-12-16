import {Component, signal} from '@angular/core';
import {AuthTemplate} from '../../templates/auth/auth-template';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth-service';
import {ResourcesService} from '../../services/resources-service';
import {NotificationService} from '../../services/notification-service';
import {TranslatePipe} from '@ngx-translate/core';
import {LoginInput} from '../../components/inputs/login-input/login-input';
import {PasswordInput} from '../../components/inputs/password-input/password-input';
import {passwordMismatchValidator} from '../../validators/password-mismatch';
import {TextInput} from '../../components/inputs/text-input/text-input';
import {LoadingButton} from '../../components/buttons/loading-button/loading-button';
import {RedirectLink} from '../../components/links/router-link/router-link';
import {RoutePath} from '../../app.routes';
import {UserRegisterInfo} from '@models/auth/req/userRegisterInfo';
import {Roles} from '@models/enums/roles';

@Component({
  selector: 'app-register-page',
  imports: [
    AuthTemplate,
    ReactiveFormsModule,
    TranslatePipe,
    LoginInput,
    PasswordInput,
    TextInput,
    LoadingButton,
    RedirectLink
  ],
  templateUrl: './register-page.html',
  styles: ``,
})
export class RegisterPage {
  registerForm: FormGroup;
  loading$ = signal(false);

  constructor(
    private router: Router,
    private  fb: FormBuilder,
    private authService: AuthService,
    private resources: ResourcesService,
    private notification: NotificationService
  ) {
    this.registerForm = this.fb.group({
      login: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(50)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(50)]],
      passwordCopy: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(50)]],
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      surname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      patronymic: ['', [Validators.minLength(3), Validators.maxLength(50)]]
    }, {
      validators: passwordMismatchValidator
    });
  }

  onLoginBlur() {
    const login = this.registerForm.value.login;
    this.authService
      .checkLoginAvailability(login)
      .subscribe(res => {
        this.registerForm.get('login')?.setErrors(!res ? { 'loginTaken': true } : null)
      });
  }

  onSubmit(): void {
    const fv = this.registerForm.value;
    const regInfo = new UserRegisterInfo(
      fv.login,
      fv.password,
      null,
      'dGVzdA==',
      fv.name,
      fv.surname,
      fv.patronymic,
      Roles.User
    );

    this.loading$.set(true);
    this.authService
      .register(regInfo)
      .subscribe({
        next: () => this.notification.success('success'),
        error: (error) => {
          this.notification.error(error)
          console.log(error)
        },
      }).add(() => this.loading$.set(false));
  }

  protected readonly RoutePath = RoutePath;
}
