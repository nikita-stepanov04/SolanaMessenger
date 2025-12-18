import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {TokenService} from './token-service';
import {Router} from '@angular/router';
import {UserLoginInfo} from '@models/auth/req/userLoginInfo';
import {map, Observable, of, switchMap, tap} from 'rxjs';
import {TokensInfo} from '@models/auth/resp/tokensInfo';
import {UserInfo} from '@models/auth/resp/userInfo';
import {UserRegisterInfo} from '@models/auth/req/userRegisterInfo';
import {BoolResponse} from '@models/global/bool-response';
import {Polices} from '@models/enums/policies';
import {Roles} from '@models/enums/roles';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
}
const USER_INFO_KEY = "UserInfo";

const POLICY_ALLOWED_ROLES = [
  {
    Policy: Polices.AuthorizedAny, Roles: [Roles.User, Roles.Admin]
  },
  {
    Policy: Polices.AuthorizedAdmins, Roles: [Roles.Admin]
  }
]

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

  public refresh(): Observable<string> {
    const refreshToken = this.tokenService.getRefreshToken();
    return this.http
      .post(this.refreshUrl, {
        refreshToken: refreshToken
      }, httpOptions)
      .pipe(
        tap((resp: any) => this.tokenService.saveAccessToken(resp.accessToken)),
        switchMap((resp: any) => of(resp.accessToken))
      );
  }

  public checkLoginAvailability(login: string): Observable<boolean> {
    return this.http
      .get<BoolResponse>(`${this.checkLoginUrl}/${login}?test=a`).pipe(
        map(res => res.result)
      );
  }

  public getUserData(): UserInfo | null {
    const infoStr = localStorage.getItem(USER_INFO_KEY);
    return infoStr ? JSON.parse(infoStr) : null;
  }

  public isAuthorized(policy: Polices): boolean {
    if (policy == Polices.NotAuthorized)
      return true;

    const userData = this.getUserData();
    if (!userData)
      return false;

    const policyData = POLICY_ALLOWED_ROLES.find(p => p.Policy === policy);
    return policyData?.Roles.find(r => r == userData.role) !== undefined;
  }

  public isAuthEndpoint(currentUrl: string): boolean {
    return this.router.config
      .filter(route => route.data && route.data['policy'].Policy != Polices.NotAuthorized)
      .map(route => `/${route.path}`)
      .some(route => route.startsWith(currentUrl));
  }
}


