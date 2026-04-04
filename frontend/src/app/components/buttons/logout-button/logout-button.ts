import {Component, inject} from '@angular/core';
import {DefaultTooltip} from "../../tooltip/default-tooltip";
import {Spinner} from "../../spinner/spinner";
import {TranslatePipe} from "@ngx-translate/core";
import {AuthActions} from '../../../state/auth/auth-actions';
import {Store} from '@ngrx/store';
import {ButtonBase} from '../button-base';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-logout-button',
  imports: [
    DefaultTooltip,
    Spinner,
    TranslatePipe,
    AsyncPipe
  ],
  templateUrl: './logout-button.html',
  styles: ``,
})
export class LogoutButton extends ButtonBase {
  private store = inject(Store);

  logout() {
    this.store.dispatch(AuthActions.logout());
  }
}
