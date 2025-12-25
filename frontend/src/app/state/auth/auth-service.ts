import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {UserLoginInfo} from './models/req/userLoginInfo';
import {map, Observable} from 'rxjs';
import {TokensInfo} from './models/resp/tokensInfo';
import {UserInfo} from './models/resp/userInfo';
import {UserRegisterInfo} from './models/req/userRegisterInfo';
import {BoolResponse} from '@models/global/bool-response';
import {AccessTokenInfo} from './models/resp/accessTokenInfo';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = `${environment.apiBaseUrl}/api/user`;
  private registerUrl = `${this.baseUrl}/registration`;
  private refreshUrl = `${this.baseUrl}/refresh`;
  private loginUrl = `${this.baseUrl}/login`;
  private checkLoginUrl = `${this.baseUrl}/check-login`;

  constructor(private http: HttpClient) {}

  login(loginInfo: UserLoginInfo): Observable<TokensInfo> {
    return this.http.post<TokensInfo>(this.loginUrl,
      loginInfo,
      httpOptions
    );
  }

  getUserInfo(login: string): Observable<UserInfo> {
    return this.http.get<UserInfo>(this.baseUrl + '/' + login);
  }

  public register(registerInfo: UserRegisterInfo): Observable<any> {
    return this.http
      .post(this.registerUrl, registerInfo, httpOptions);
  }

  public refresh(refreshToken: string): Observable<AccessTokenInfo> {
    return this.http
      .post<AccessTokenInfo>(this.refreshUrl, {
        refreshToken: refreshToken
      }, httpOptions);
  }

  public checkLoginAvailability(login: string): Observable<boolean> {
    return this.http
      .get<BoolResponse>(`${this.checkLoginUrl}/${login}?test=a`).pipe(
        map(res => res.result)
      );
  }
}


