import { Routes } from '@angular/router';
import {LoginPage} from './pages/login-page/login-page';
import {ChatPage} from './pages/home-page/chat-page';
import {RegisterPage} from './pages/register-page/register-page';
import {Polices} from '@models/enums/policies';
import {AuthGuardService} from './services/auth-guard-service';

export enum RoutePath {
  Login = 'login',
  Home = 'home',
  Register = 'register',
}

export const routes: Routes = [
  {
    path: RoutePath.Login,
    component: LoginPage,
    canActivate: [AuthGuardService],
    data: { policy: Polices.NotAuthorized }
  },
  {
    path: RoutePath.Home,
    component: ChatPage,
    canActivate: [AuthGuardService],
    data: { policy: Polices.AuthorizedAny }
  },
  {
    path: RoutePath.Register,
    component: RegisterPage,
    canActivate: [AuthGuardService],
    data: { policy: Polices.NotAuthorized }
  },
  {
    path: '',
    redirectTo: '/' + RoutePath.Home, pathMatch: 'full'
  }
];
