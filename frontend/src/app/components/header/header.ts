import {AfterViewInit, Component} from '@angular/core';
import {AuthService} from '../../services/auth-service';
import {DefaultTooltip} from '../tooltip/default-tooltip';
import {TranslatePipe} from '@ngx-translate/core';
import {LanguageSelect} from '../selects/language-select/language-select';

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
  constructor(private auth: AuthService) {}

  logout() {
    this.auth.logout();
  }


}
