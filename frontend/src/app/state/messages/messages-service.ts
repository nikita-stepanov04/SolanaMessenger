import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {Message} from './models/message';
import {WriteMessage} from './models/write-message';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  constructor(
    private http: HttpClient) {}

  private baseUrl = `${environment.apiBaseUrl}/api/message`;

  getMessages(chatID: string, lastMessageTimestamp: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.baseUrl}/list/${chatID}/${lastMessageTimestamp ?? 0}`);
  }

  sendMessage(message: WriteMessage) {
    return this.http.post(`${this.baseUrl}`, message);
  }
}
