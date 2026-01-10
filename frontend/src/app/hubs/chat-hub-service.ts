import {inject, Injectable} from '@angular/core';
import * as signalR from '@microsoft/signalr';
import {Store} from '@ngrx/store';
import {environment} from '../../environments/environment';
import {AuthSelectors} from '../state/auth/auth.selectors';
import {TokensInfo} from '../state/auth/models/resp/tokensInfo';
import {AuthActions} from '../state/auth/auth-actions';
import {ChatHubEventHandlers} from './chat-hub-event-handlers';
import {findAnnotatedMethods} from './chat-hub-event-decorator';

@Injectable({
  providedIn: 'root',
})
export class ChatHubService {
  private store = inject(Store);
  private handlers = inject(ChatHubEventHandlers);
  private connection: signalR.HubConnection | null = null;

  private hubUrl = `${environment.apiBaseUrl}/ws/chats`;

  constructor() {
    this.store
      .select(AuthSelectors.tokenInfo)
      .subscribe(tokenInfo => {
        if (tokenInfo)
          this.connect(tokenInfo);
        else
          this.disconnect();
      })
  }

  public connect(tokenInfo: TokensInfo) {
    if (this.connection)
      return;

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(this.hubUrl, {
        accessTokenFactory: () => tokenInfo.accessToken,
        transport: signalR.HttpTransportType.WebSockets
      })
      .configureLogging(signalR.LogLevel.Error)
      .withAutomaticReconnect()
      .build();

    findAnnotatedMethods(this.handlers).forEach(info =>
      this.connection?.on(info.event, params => info.handler(params)));

    this.connection.start()
      .then(() => console.log('Connected to SignalR ChatHub'))
      .catch(err => {
        if (err.message && err.message.includes(`Status code '401'`)) {
          this.connection = null;
          this.store.dispatch(AuthActions.refresh());
        }
      });
  }

  public disconnect() {
    if (!this.connection)
      return;

    this.connection.stop()
      .then(() => console.log('Disconnected from SignalR ChatHub'));
  }
}
