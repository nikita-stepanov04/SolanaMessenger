import { Injectable } from '@angular/core';
import {NotificationService} from './notification-service';

const TOKEN_KEY = "AccessToken";
const REFRESH_TOKEN_KEY = "RefreshToken";

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  public saveAccessToken(token: string) {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.setItem(TOKEN_KEY, token);
  }

  public getAccessToken(): string {
    return localStorage.getItem(TOKEN_KEY) ?? "";
  }

  public saveRefreshToken(token: string) {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  }

  public getRefreshToken(): string {
    return localStorage.getItem(REFRESH_TOKEN_KEY) ?? "";
  }

  public clearTokens() {
    localStorage.setItem(TOKEN_KEY, '');
    localStorage.setItem(REFRESH_TOKEN_KEY, '');
  }
}
