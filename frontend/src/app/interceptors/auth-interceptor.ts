import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {AuthService} from '../services/auth-service';
import {TokenService} from '../services/token-service';
import {catchError, Observable, switchMap, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {RoutePath} from '../app.routes';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const tokens = inject(TokenService);
  const router = inject(Router);

  const accessToken = tokens.getAccessToken();
  if (!accessToken)
    return next(req);

  const authReq = setAuth(accessToken);

  return next(authReq).pipe(
    catchError((err: HttpErrorResponse): Observable<any> => {
      if (err.status === 401) {
        return auth.refresh()
          .pipe(
            switchMap(newAccessToken => {
              const newAuthReq = setAuth(newAccessToken);
              return next(newAuthReq);
            }),
            catchError((err: HttpErrorResponse) => {
              router.navigate([RoutePath.Login])
              return throwError(() => err)
            })
          );
      }
      return throwError(() => err);
    })
  )

  function setAuth(accessToken: string) {
    return req.clone({
      setHeaders: { Authorization: `Bearer ${accessToken}` }
    })
  }
};
