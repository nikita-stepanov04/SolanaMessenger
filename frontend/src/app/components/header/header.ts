import {Component} from '@angular/core';
import {DefaultTooltip} from '../tooltip/default-tooltip';
import {TranslatePipe} from '@ngx-translate/core';
import {LanguageSelect} from '../selects/language-select/language-select';
import {Store} from '@ngrx/store';
import {rootActions} from '../../state/root/root.actions';

@Component({
  selector: 'app-header',
  imports: [
    DefaultTooltip,
    TranslatePipe,
    LanguageSelect
  ],
  templateUrl: './header.html',
  styles: ``,
})
export class Header{
  constructor(private store: Store) {}

  logout() {
    this.store.dispatch(rootActions.clearStore());
  }
}
