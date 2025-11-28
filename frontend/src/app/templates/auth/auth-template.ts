import { Component } from '@angular/core';
import {Footer} from '../../components/footer/footer';
import {ComponentBase} from '../../components/component-base';

@Component({
  selector: 'app-auth-template',
  imports: [
    Footer
  ],
  templateUrl: './auth-template.html',
  styles: ``,
})
export class AuthTemplate extends ComponentBase {

}
