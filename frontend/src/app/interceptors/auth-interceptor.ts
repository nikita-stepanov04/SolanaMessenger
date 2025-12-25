import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {catchError, filter, Observable, switchMap, take, throwError} from 'rxjs';
import {Store} from '@ngrx/store';
import {AuthSelectors} from '../state/auth/auth.selectors';
import {TokensInfo} from '../state/auth/models/resp/tokensInfo';
import {AuthActions} from '../state/auth/auth-actions';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(Store);

  return store.select(AuthSelectors.tokenInfo).pipe(
    take(1),
    switchMap((tokensInfo: TokensInfo | null) => {
      if (!tokensInfo)
        return next(req);

      const authReq = setAuth(tokensInfo.accessToken);
      return next(authReq).pipe(
        catchError((err: HttpErrorResponse): Observable<any> => {
          if (err.status !== 401)
            return throwError(() => err);

          store.dispatch(AuthActions.refresh());
          return store.select(AuthSelectors.state).pipe(
            filter(state => state.loaded || !!state.error),
            switchMap(state => {
              if (state.error)
                return throwError(() => err);
              const newAuthReq = setAuth(state.tokenInfo!.accessToken)
              return next(newAuthReq);
            })
          );
        })
      );
    })
  );

  function setAuth(accessToken: string) {
    return req.clone({
      setHeaders: { Authorization: `Bearer ${accessToken}` }
    })
  }
};
