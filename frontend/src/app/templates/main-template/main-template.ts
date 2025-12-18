import { Component } from '@angular/core';
import {Footer} from "../../components/footer/footer";
import {LanguageSelect} from "../../components/selects/language-select/language-select";
import {Header} from '../../components/header/header';

@Component({
  selector: 'app-main-template',
  imports: [
    Footer,
    LanguageSelect,
    Header
  ],
  templateUrl: './main-template.html',
  styles: ``,
})
export class MainTemplate {

}
