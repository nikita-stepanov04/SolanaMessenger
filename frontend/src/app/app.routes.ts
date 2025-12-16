import { Routes } from '@angular/router';
import {LoginPage} from './pages/login-page/login-page';
import {HomePage} from './pages/home-page/home-page';
import {RegisterPage} from './pages/register-page/register-page';

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
    path: RoutePath.Register,
    component: RegisterPage
  },
  {
    path: '',
    redirectTo: '/' + RoutePath.Home, pathMatch: 'full'
  }
];
