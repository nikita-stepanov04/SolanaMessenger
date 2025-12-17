import {booleanAttribute, Component, signal} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {LoginInput} from '../../components/inputs/login-input/login-input';
import {AuthTemplate} from '../../templates/auth/auth-template';
import {TranslatePipe} from '@ngx-translate/core';
import {PasswordInput} from '../../components/inputs/password-input/password-input';
import {AuthService} from '../../services/auth-service';
import {UserLoginInfo} from '@models/auth/req/userLoginInfo';
import {NotificationService} from '../../services/notification-service';
import {Router} from '@angular/router';
import {ResourcesService} from '../../services/resources-service';
import {LoadingButton} from '../../components/buttons/loading-button/loading-button';
import {RedirectLink} from '../../components/links/router-link/router-link';
import {RoutePath} from '../../app.routes';
import {catchError, of} from 'rxjs';

@Component({
  selector: 'app-login-page',
  imports: [
    ReactiveFormsModule,
    LoginInput,
    AuthTemplate,
    TranslatePipe,
    PasswordInput,
    LoadingButton,
    RedirectLink,
  ],
  templateUrl: './login-page.html',
  styles: ``,
})
export class LoginPage {
  readonly RoutePath = RoutePath;
  loginForm: FormGroup;
  loading$ = signal<boolean>(false);

  constructor(
    private router: Router,
    private  fb: FormBuilder,
    private authService: AuthService,
    private resources: ResourcesService,
    private notification: NotificationService
  ) {
    this.loginForm = this.fb.group({
      login: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(50)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(50)]],
    });
  }

  onSubmit(): void {
    const fv = this.loginForm.value;
    this.loading$.set(true);
    this.authService
      .logIn(new UserLoginInfo(fv.login, fv.password))
      .subscribe({
        next: () => {
          this.router.navigate([RoutePath.Home])
            .then(() => this.notification.success(
              this.resources.get('str013'))); // Login successful
        },
        error: () => this.notification.error(this.resources.get('str014')) // Incorrect login or password
      }).add(() => this.loading$.set(false));
  }
}
