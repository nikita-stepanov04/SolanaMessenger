import {Component, inject, Input} from '@angular/core';
import {AsyncPipe, NgClass} from '@angular/common';
import {Store} from '@ngrx/store';
import {ResourcesSelectors} from '../../../state/resources/resources-selectors';
import {ResourcesActions} from '../../../state/resources/resources-actions';
import {DefaultTooltip} from '../../tooltip/default-tooltip';
import {NgbDropdown, NgbDropdownItem, NgbDropdownMenu, NgbDropdownToggle} from '@ng-bootstrap/ng-bootstrap';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-language-select',
  imports: [NgClass, AsyncPipe, DefaultTooltip, NgbDropdown, NgbDropdownToggle, NgbDropdownMenu, NgbDropdownItem, TranslatePipe],
  templateUrl: './language-select.html',
  styles: ``,
})

export class LanguageSelect {
  @Input() class: string;

  protected store = inject(Store);
  protected readonly ResourcesSelectors = ResourcesSelectors;
  protected readonly ResourcesActions = ResourcesActions;
}
