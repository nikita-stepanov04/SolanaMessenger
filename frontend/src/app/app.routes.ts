import { Routes } from '@angular/router';
import {LoginPage} from './pages/login-page/login-page';
import {ChatPage} from './pages/chat-page/chat-page';
import {RegisterPage} from './pages/register-page/register-page';
import {Polices} from '@models/enums/policies';
import {AuthGuardService} from './services/auth-guard-service';

export enum RoutePath {
  Login = 'login',
  Chats = 'chats',
  Register = 'register',
}

export const routes: Routes = [
  {
    path: RoutePath.Login,
    component: LoginPage,
    canActivate: [AuthGuardService],
    title: 'str003',
    data: { policy: Polices.NotAuthorized }
  },
  {
    path: RoutePath.Chats,
    component: ChatPage,
    canActivate: [AuthGuardService],
    title: 'str035',
    data: { policy: Polices.AuthorizedAny }
  },
  {
    path: RoutePath.Register,
    component: RegisterPage,
    canActivate: [AuthGuardService],
    title: 'str004',
    data: { policy: Polices.NotAuthorized }
  },
  {
    path: '',
    redirectTo: '/' + RoutePath.Chats, pathMatch: 'full'
  }
];
