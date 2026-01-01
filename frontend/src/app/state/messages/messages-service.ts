import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {Message} from './messages-models';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  constructor(
    private http: HttpClient) {}

  private baseUrl = `${environment.apiBaseUrl}/api/message/list`;

  getMessages(chatID: string, lastMessageTimestamp: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.baseUrl}/${chatID}/${lastMessageTimestamp ?? 0}`);
  }
}
