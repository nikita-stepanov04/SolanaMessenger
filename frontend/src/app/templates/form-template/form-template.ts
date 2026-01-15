import {Component, Input} from '@angular/core';
import {Footer} from '../../components/footer/footer';
import {ComponentBase} from '../../components/component-base';
import {LanguageSelect} from '../../components/selects/language-select/language-select';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-form-template',
  imports: [
    Footer,
    LanguageSelect,
    NgClass
  ],
  templateUrl: './form-template.html',
  styles: ``,
})
export class FormTemplate extends ComponentBase {
  @Input() isWide = false;
}
