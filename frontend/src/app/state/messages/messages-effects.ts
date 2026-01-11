import {inject, Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {MessagesService} from './messages-service';
import {NotificationService} from '../../services/notification-service';
import {MessagesActions} from './messages-actions';
import {catchError, concatMap, filter, from, map, mergeMap, of, switchMap, tap, withLatestFrom} from 'rxjs';
import {Action, Store} from '@ngrx/store';
import {ChatsSelectors} from '../chats/chats-selectors';
import {environment} from '../../../environments/environment';
import {ChatActions} from '../chats/chats-actions';
import {MessagesSelectors} from './messages-selectors';
import {CryptographyService} from '../../services/cryptography-service';
import {ResourcesService} from '../resources/resources-service';

@Injectable()
export class MessagesEffects {
  private store = inject(Store);
  private actions$ = inject(Actions);
  private crypto = inject(CryptographyService);
  private messagesService = inject(MessagesService);
  private resources = inject(ResourcesService);
  private notifications = inject(NotificationService);
  private messagesPerRequest = environment.messagesPerRequest;

  loadMessages$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MessagesActions.loadNextMessagesBatchForOpenedChat),
      withLatestFrom(
        this.store.select(ChatsSelectors.openedChat),
        this.store.select(MessagesSelectors.openedChatLastMessageTimestamp),
      ),
      concatMap(([_, chat, timestamp]) =>
        this.messagesService.getMessages(chat!.id, timestamp).pipe(
          map(messages => messages.map(message => this.crypto.decryptMessage(message, chat!.cek))),
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

  sendMessages$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MessagesActions.sendMessage),
      withLatestFrom(this.store.select(ChatsSelectors.openedChat)),
      map(([action, chat]) => {
        const writeMessage = this.crypto.encryptMessage(action.message, chat!.cek);
        return {writeMessage: writeMessage, originalMessage: action.message}
      }),
      mergeMap(({writeMessage, originalMessage}) =>
        this.messagesService.sendMessage(writeMessage).pipe(
          map(() => MessagesActions.sendMessageSuccess({messageID: originalMessage.id})),
          catchError(err => of(MessagesActions.sendMessageFailure({messageID: originalMessage.id, error: err})))
        ))
    ));

  newMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MessagesActions.newMessage),
      withLatestFrom(this.store.select(ChatsSelectors.openedChat)),
      filter(([action, openedChat]) => openedChat?.id !== action.message.chatID),
      tap(([action]) => this.notifications.newMessage(action.message)),
      map(([action]) => ChatActions.newMessage({ chatID: action.message.chatID }))
    )
  );

  notifyErrors$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MessagesActions.loadMessagesFailure),
      tap(({error}) => this.notifications.error(error))
    ), { dispatch: false });

  notifySendMessageError$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MessagesActions.sendMessageFailure),
      withLatestFrom(this.resources.get('str040')),
      tap(([_, errorMessage]) => this.notifications.error(errorMessage))
    ), { dispatch: false });
}
