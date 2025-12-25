import {inject, Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, exhaustMap, filter, map, of, tap, withLatestFrom} from 'rxjs';
import {ChatsService} from './chats-service';
import {NotificationService} from '../../services/notification-service';
import {routerNavigationAction} from '@ngrx/router-store';
import {RoutePath} from '../../app.routes';
import {Store} from '@ngrx/store';
import {ChatsSelectors} from './chats-selectors';
import {ChatActions} from './chats-actions';


@Injectable()
export class ChatsEffects {
  private store = inject(Store);
  private actions$ = inject(Actions);
  private chatsService = inject(ChatsService);
  private notifications = inject(NotificationService);

  loadOnRoute$ = createEffect(() =>
    this.actions$.pipe(
      ofType(routerNavigationAction),
      filter(action => action.payload.event.url.startsWith(`/${RoutePath.Chats}`)),
      withLatestFrom(this.store.select(ChatsSelectors.loaded)),
      filter(([_, loaded]) => !loaded),
      map(() => ChatActions.loadChats())
    ));

  loadChats$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChatActions.loadChats),
      exhaustMap(() =>
        this.chatsService.getChats().pipe(
          map(chats => ChatActions.loadChatsSuccess({chats})),
          catchError(err => of(ChatActions.loadChatsFailure({ error: err})))
        )
      )
    ));

  notifyErrors$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChatActions.loadChatsFailure),
      tap(({error}) => this.notifications.error(error))
    ), { dispatch: false });
}
