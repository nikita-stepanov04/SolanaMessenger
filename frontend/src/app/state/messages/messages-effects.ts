import {inject, Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {MessagesService} from './messages-service';
import {NotificationService} from '../../services/notification-service';
import {MessagesActions} from './messages-actions';
import {catchError, exhaustMap, map, of, tap} from 'rxjs';

@Injectable()
export class MessagesEffects {
  private actions$ = inject(Actions);
  private messagesService = inject(MessagesService);
  private notifications = inject(NotificationService);

  loadMessages$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MessagesActions.loadMessages),
      exhaustMap(action =>
        this.messagesService.getChats(action.chatID, action.lastMessageTimestamp).pipe(
          map(messages => MessagesActions.loadMessagesSuccess({ messages })),
          catchError(error => of(MessagesActions.loadMessagesFailure({ error })))
        )
      )
    )
  );

  notifyErrors$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MessagesActions.loadMessagesFailure),
      tap(({error}) => this.notifications.error(error))
    ), { dispatch: false });
}
