import { Component } from '@angular/core';
import {Footer} from '../../components/footer/footer';
import {ComponentBase} from '../../components/component-base';
import {LanguageSelect} from '../../components/selects/language-select/language-select';

@Component({
  selector: 'app-auth-template',
  imports: [
    Footer,
    LanguageSelect
  ],
  templateUrl: './auth-template.html',
  styles: ``,
})
export class AuthTemplate extends ComponentBase {

}
