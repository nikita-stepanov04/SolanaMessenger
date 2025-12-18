import {Component, Input} from '@angular/core';
import {ResourcesService} from '../../../services/resources-service';
import {NgClass} from '@angular/common';
import {DefaultTooltip} from '../../tooltip/default-tooltip';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-language-select',
  imports: [
    NgClass,
    DefaultTooltip,
    TranslatePipe
  ],
  templateUrl: './language-select.html',
  styles: ``,
})

export class LanguageSelect {
  @Input() class: string;

  constructor(protected resource: ResourcesService) {}
}
