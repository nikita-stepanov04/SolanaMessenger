import { Component} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Notification} from './components/notification/notification';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Notification],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App {}
