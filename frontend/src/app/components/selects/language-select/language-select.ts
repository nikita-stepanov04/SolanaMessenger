import {Component, Input} from '@angular/core';
import {ResourcesService} from '../../../services/resources-service';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-language-select',
  imports: [NgClass],
  templateUrl: './language-select.html',
  styles: ``,
})

export class LanguageSelect {
  @Input() class: string;

  constructor(protected resource: ResourcesService) {}
}
