import {inject, Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {loadChats, loadChatsFailure, loadChatsSuccess} from './chats.actions';
import {catchError, exhaustMap, filter, map, of, tap, withLatestFrom} from 'rxjs';
import {ChatsService} from './chats.service';
import {NotificationService} from '../../services/notification-service';
import {routerNavigationAction} from '@ngrx/router-store';
import {RoutePath} from '../../app.routes';
import {Store} from '@ngrx/store';
import {selectChatsLoaded} from './chats.selectors';


@Injectable()
export class ChatsEffects {
  private store = inject(Store);
  private actions$ = inject(Actions);
  private chats = inject(ChatsService);
  private notifications = inject(NotificationService);

  loadOnRoute$ = createEffect(() =>
    this.actions$.pipe(
      ofType(routerNavigationAction),
      filter(action => action.payload.event.url.startsWith(`/${RoutePath.Chats}`)),
      withLatestFrom(this.store.select(selectChatsLoaded)),
      filter(([_, loaded]) => !loaded),
      map(() => loadChats())
    ))

  loadChats$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadChats),
      exhaustMap(() =>
        this.chats.getChats().pipe(
          map(chats => loadChatsSuccess({chats})),
          catchError(err => of(loadChatsFailure({ error: err})))
        )
      )
    ));

  notifyErrors$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadChatsFailure),
      tap(({error}) => this.notifications.error(error))
    ), { dispatch: false });
}
