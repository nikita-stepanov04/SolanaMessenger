import {inject, Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {loadChats, loadChatsFailure, loadChatsSuccess} from './chats.actions';
import {catchError, exhaustMap, map, of, tap} from 'rxjs';
import {ChatsService} from './chats.service';
import {NotificationService} from '../../services/notification-service';

@Injectable()
export class ChatsEffects {
  private actions$ = inject(Actions);
  private chats = inject(ChatsService);
  private notifications = inject(NotificationService);

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
