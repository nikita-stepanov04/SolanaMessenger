import { Component } from '@angular/core';
import {Footer} from "../../components/footer/footer";
import {Header} from '../../components/header/header';

@Component({
  selector: 'app-main-template',
  imports: [
    Footer,
    Header
  ],
  templateUrl: './main-template.html',
  styles: ``,
})
export class MainTemplate {

}
