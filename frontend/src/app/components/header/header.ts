import {Component, inject} from '@angular/core';
import {DefaultTooltip} from '../tooltip/default-tooltip';
import {TranslatePipe} from '@ngx-translate/core';
import {LanguageSelect} from '../selects/language-select/language-select';
import {Store} from '@ngrx/store';
import {Router} from '@angular/router';
import {RoutePath} from '../../app.routes';
import {AuthSelectors} from '../../state/auth/auth.selectors';
import {Polices} from '@models/enums/policies';
import {AsyncPipe} from '@angular/common';
import {LogoutButton} from '../buttons/logout-button/logout-button';

@Component({
  selector: 'app-header',
  imports: [
    DefaultTooltip,
    TranslatePipe,
    LanguageSelect,
    AsyncPipe,
    LogoutButton
  ],
  templateUrl: './header.html',
  styles: ``,
})
export class Header{
  private store = inject(Store);
  private router = inject(Router);
  protected isLogOuting$ = this.store.select((AuthSelectors.loading));
  protected isAdmin$ = this.store.select(AuthSelectors.isAuthorized(Polices.AuthorizedAdmins));

  toChatCreatePage() {
    this.router.navigate([RoutePath.CreateChat]);
  }
}
