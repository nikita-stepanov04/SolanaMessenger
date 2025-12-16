import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {TokenService} from './token-service';
import {Router} from '@angular/router';
import {UserLoginInfo} from '@models/auth/req/userLoginInfo';
import {Observable, switchAll, switchMap, tap} from 'rxjs';
import {TokensInfo} from '@models/auth/resp/tokensInfo';
import {UserInfo} from '@models/auth/resp/userInfo';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
}
const USER_INFO_KEY = "UserInfo";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = `${environment.apiBaseUrl}/api/user`;
  private registerUrl = `${this.baseUrl}/registration`;
  private refreshUrl = `${this.baseUrl}/refresh`;
  private loginUrl = `${this.baseUrl}/login`;

  constructor(
    private router: Router,
    private http: HttpClient,
    private tokenService: TokenService ) {}

  public logIn(loginInfo: UserLoginInfo): Observable<UserInfo> {
    return this.http
      .post<TokensInfo>(this.loginUrl, loginInfo, httpOptions)
      .pipe(
        tap((data: TokensInfo) => {
          this.tokenService.saveAccessToken(data.accessToken);
          this.tokenService.saveRefreshToken(data.refreshToken);
        }),
        switchMap(() => this.http
          .get<UserInfo>(this.baseUrl + '/' + loginInfo.login)
          .pipe(
            tap((resp: UserInfo) => localStorage.setItem(USER_INFO_KEY, JSON.stringify(resp)))
          )
        )
      )
  }

  private getUserInfo(): UserInfo | null {
    const str = localStorage.getItem(USER_INFO_KEY);
    return str ? JSON.parse(str) : null;
  }

  private isAuthEndpoint(currentUrl: string) {
    return this.router.config
      .filter(route => route.data && route.data['expectedRole'])
      .map(route => `/${route.path}`)
      .some(route => route.startsWith(currentUrl));
  }
}
