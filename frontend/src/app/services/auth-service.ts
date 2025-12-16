import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {TokenService} from './token-service';
import {Router} from '@angular/router';
import {UserLoginInfo} from '@models/auth/req/userLoginInfo';
import {map, Observable, switchMap, tap} from 'rxjs';
import {TokensInfo} from '@models/auth/resp/tokensInfo';
import {UserInfo} from '@models/auth/resp/userInfo';
import {UserRegisterInfo} from '@models/auth/req/userRegisterInfo';
import {BoolResponse} from '@models/global/bool-response';

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
  private checkLoginUrl = `${this.baseUrl}/check-login`;

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
      );
  }

  public register(registerInfo: UserRegisterInfo): Observable<any> {
    return this.http
      .post(this.registerUrl, registerInfo, httpOptions);
  }

  public checkLoginAvailability(login: string): Observable<boolean> {
    return this.http
      .get<BoolResponse>(`${this.checkLoginUrl}/${login}`).pipe(
        map(res => res.result)
      );
  }

  private isAuthEndpoint(currentUrl: string) {
    return this.router.config
      .filter(route => route.data && route.data['expectedRole'])
      .map(route => `/${route.path}`)
      .some(route => route.startsWith(currentUrl));
  }
}
