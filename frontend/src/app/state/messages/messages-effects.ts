import {inject, Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {MessagesService} from './messages-service';
import {NotificationService} from '../../services/notification-service';
import {MessagesActions} from './messages-actions';
import {catchError, concatMap, exhaustMap, from, of, switchMap, tap, withLatestFrom} from 'rxjs';
import {Action, Store} from '@ngrx/store';
import {ChatsSelectors} from '../chats/chats-selectors';
import {environment} from '../../../environments/environment';
import {ChatActions} from '../chats/chats-actions';
import {Message} from './messages-models';
import {MessagesSelectors} from './messages-selectors';

@Injectable()
export class MessagesEffects {
  private store = inject(Store);
  private actions$ = inject(Actions);
  private messagesService = inject(MessagesService);
  private notifications = inject(NotificationService);
  private messagesPerRequest = environment.messagesPerRequest;

  loadMessages$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MessagesActions.loadNextMessagesBatchForOpenedChat),
      withLatestFrom(
        this.store.select(ChatsSelectors.openedChat),
        this.store.select(MessagesSelectors.openedChatLastMessageTimestamp)
      ),
      concatMap(([_, chat, timestamp]) =>
        this.messagesService.getMessages(chat!.id, timestamp).pipe(
          switchMap(messages => {
            const actions: Action[] = [MessagesActions.loadMessagesSuccess({ messages: messages })];
            if (messages.length < this.messagesPerRequest)
              actions.unshift(ChatActions.setAllMessagesFetchedForOpenedChat());
            return from(actions);
          }),
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
