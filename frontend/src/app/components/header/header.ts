import {Component, inject} from '@angular/core';
import {DefaultTooltip} from '../tooltip/default-tooltip';
import {TranslatePipe} from '@ngx-translate/core';
import {LanguageSelect} from '../selects/language-select/language-select';
import {Store} from '@ngrx/store';
import {rootActions} from '../../state/root/root-actions';
import {Router} from '@angular/router';
import {RoutePath} from '../../app.routes';
import {AuthSelectors} from '../../state/auth/auth.selectors';
import {Polices} from '@models/enums/policies';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [
    DefaultTooltip,
    TranslatePipe,
    LanguageSelect,
    AsyncPipe
  ],
  templateUrl: './header.html',
  styles: ``,
})
export class Header{
  private store = inject(Store);
  private router = inject(Router);
  protected isAdmin$ = this.store.select(AuthSelectors.isAuthorized(Polices.AuthorizedAdmins));

  logout() {
    this.store.dispatch(rootActions.clearStore());
  }

  toChatCreatePage() {
    this.router.navigate([RoutePath.CreateChat]);
  }
}
