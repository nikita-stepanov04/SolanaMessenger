import {inject, Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, concatMap, exhaustMap, filter, map, of, tap, withLatestFrom} from 'rxjs';
import {ChatsService} from './chats-service';
import {NotificationService} from '../../services/notification-service';
import {routerNavigationAction} from '@ngrx/router-store';
import {RoutePath} from '../../app.routes';
import {Store} from '@ngrx/store';
import {ChatsSelectors} from './chats-selectors';
import {ChatActions} from './chats-actions';
import {CryptographyService} from '../../services/cryptography-service';
import {AuthSelectors} from '../auth/auth.selectors';

@Injectable()
export class ChatsEffects {
  private store = inject(Store);
  private actions$ = inject(Actions);
  private chatsService = inject(ChatsService);
  private crypto = inject(CryptographyService);
  private notifications = inject(NotificationService);

  loadOnRoute$ = createEffect(() =>
    this.actions$.pipe(
      ofType(routerNavigationAction),
      filter(action => action.payload.routerState.root.firstChild?.routeConfig?.path == RoutePath.Chats),
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

  loadChatInfo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChatActions.openChat),
      withLatestFrom(
        this.store.select(ChatsSelectors.openedChat),
        this.store.select(AuthSelectors.state)
      ),
      exhaustMap(([_, chat, authState]) => {
        if (chat!.usersData)
          return of(ChatActions.loadChatInfoSuccess({chat: chat!}));

        return this.chatsService.getChatInfo(chat!.id).pipe(
          map(chat => this.crypto.deriveCEK(authState.x25519Priv, authState.userInfo!.id, chat)),
          map(chat => ChatActions.loadChatInfoSuccess({chat})),
          catchError(err => of(ChatActions.loadChatInfoFailure({ error: err})))
        )
      })
    ));

  loadChatInfoById$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ChatActions.loadChatInfoById),
      withLatestFrom(
        this.store.select(AuthSelectors.state)
      ),
      concatMap(([action, authState]) =>
        this.chatsService.getChatInfo(action.chatID).pipe(
          map(chat => this.crypto.deriveCEK(authState.x25519Priv, authState.userInfo!.id, chat)),
          map(chat => ChatActions.loadChatInfoByIdSuccess({chat})),
          catchError(err => of(ChatActions.loadChatInfoByIdFailure({ error: err})))
        )
      ),
    );
  });


  notifyErrors$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChatActions.loadChatsFailure),
      tap(({error}) => this.notifications.error(error))
    ), { dispatch: false });

  notifyChatInfoErrors$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        ChatActions.loadChatInfoFailure,
        ChatActions.loadChatInfoByIdFailure
      ),
      tap(({error}) => this.notifications.error(error))
    ), { dispatch: false });
}
