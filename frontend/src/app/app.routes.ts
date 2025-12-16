import { Routes } from '@angular/router';
import {LoginPage} from './pages/login-page/login-page';
import {HomePage} from './pages/home-page/home-page';

export enum RoutePath {
  Login = 'login',
  Home = 'home',
  Register = 'register',
}

export const routes: Routes = [
  {
    path: RoutePath.Login,
    component: LoginPage
  },
  {
    path: RoutePath.Home,
    component: HomePage
  },
  {
    path: '',
    redirectTo: '/' + RoutePath.Home, pathMatch: 'full'
  }
];
