import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Chat} from './chats-models';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatsService {
  constructor(
    private http: HttpClient) {}

  private baseUrl = `${environment.apiBaseUrl}/api/chat`;
  private getChatsUrl = `${this.baseUrl}/all`;

  getChats(): Observable<Chat[]> {
    return this.http.get<Chat[]>(this.getChatsUrl);
  }
}
