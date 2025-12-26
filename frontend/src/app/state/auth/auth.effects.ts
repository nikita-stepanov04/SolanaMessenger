import {inject, Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {NotificationService} from '../../services/notification-service';
import {AuthService} from './auth-service';
import {AuthActions} from './auth-actions';
import {catchError, exhaustMap, map, of, switchMap, tap, withLatestFrom} from 'rxjs';
import {AuthSelectors} from './auth.selectors';
import {ResourcesService} from '../../services/resources-service';
import {Router} from '@angular/router';
import {RoutePath} from '../../app.routes';
import {rootActions} from '../root/root-actions';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);

  private store = inject(Store);
  private router = inject(Router);
  private authService = inject(AuthService);
  private resources = inject(ResourcesService);
  private notifications = inject(NotificationService);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      exhaustMap(action =>
        this.authService.login(action.loginInfo).pipe(
          map(tokenInfo => AuthActions.loginSuccess({tokenInfo: tokenInfo, login: action.loginInfo.login})),
          catchError(err => of(AuthActions.loginError({ error: err})))
        )
      )
    )
  );

  loginSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginSuccess),
      switchMap(action =>
        this.authService.getUserInfo(action.login).pipe(
          map(userInfo => AuthActions.userInfoSuccess({ userInfo })),
          catchError(err => of(AuthActions.userInfoError({ error: err })))
        ))
    )
  );

  refresh$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.refresh),
      withLatestFrom(this.store.select(AuthSelectors.tokenInfo)),
      exhaustMap(([_, tokenInfo]) =>
        this.authService.refresh(tokenInfo!.refreshToken).pipe(
          map(accessTokenInfo => AuthActions.refreshSuccess({ accessTokensInfo: accessTokenInfo })),
          catchError(err => of(AuthActions.refreshError({ error: err })))
        )
      )
    )
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(rootActions.clearStore),
      exhaustMap(() => this.router.navigate([RoutePath.Login])),
    ), { dispatch: false }
  );

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      exhaustMap(action =>
        this.authService.register(action.registerInfo).pipe(
          map(() => AuthActions.registerSuccess()),
          catchError(err => of(AuthActions.registerError({ error: err })))
        )
      )
    )
  );

  registerSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.registerSuccess),
      exhaustMap(() => this.resources.getObs('str027')),
      tap(text => {
        this.notifications.success(text);
        this.router.navigate([RoutePath.Login]);
      })
    ), { dispatch: false }
  );

  registerError$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.registerError),
      exhaustMap(() => this.resources.getObs('str034')),
      tap(errorText => this.notifications.error(errorText))
    ), { dispatch: false });

  loginError$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginError),
      exhaustMap(() => this.resources.getObs('str014')),
      tap(errorText => this.notifications.error(errorText))
    ), { dispatch: false });

  userInfoSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.userInfoSuccess),
      exhaustMap(() => this.resources.getObs('str013')),
      tap(text => {
        this.notifications.success(text);
        this.router.navigate([RoutePath.Chats]);
      })
    ), { dispatch: false });

  userInfoError$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.userInfoError),
      tap(error => this.notifications.error(error))
    ), { dispatch: false });

  refreshError$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.refreshError),
      tap(error => {
        this.router.navigate([RoutePath.Login]);
        this.notifications.error(error);
      })
    ), { dispatch: false });
}
