import {AfterViewInit, Component} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Notification} from './components/notification/notification';
import * as bootstrap from 'bootstrap'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Notification],
  templateUrl: './app.html'
})

export class App implements AfterViewInit {
    ngAfterViewInit(): void {
      const tooltipTriggerList = Array.from(document.querySelectorAll(
        '[data-bs-toggle="tooltip"]'));
      tooltipTriggerList.forEach(el => {
        new bootstrap.Tooltip(el);
        console.log('tooltip found')
      });
    }
}
