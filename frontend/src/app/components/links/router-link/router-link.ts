import {Component, Input} from '@angular/core';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-router-link',
  imports: [
    RouterLink
  ],
  templateUrl: './router-link.html',
  styles: ``,
})

export class RedirectLink {
  @Input() text: string;
  @Input() path: string;
}
