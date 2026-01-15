import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Chat, CreateChat} from './chats-models';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {UserInfo} from '../auth/models/resp/userInfo';

@Injectable({
  providedIn: 'root'
})
export class ChatsService {
  constructor(
    private http: HttpClient) {}

  private baseUrl = `${environment.apiBaseUrl}/api/chat`;
  private chatsUrl = `${this.baseUrl}/all`;
  private createChatUrl = `${this.baseUrl}/create`;
  private searchForUsersUrl = `${environment.apiBaseUrl}/api/user/search`;

  getChats(): Observable<Chat[]> {
    return this.http.get<Chat[]>(this.chatsUrl);
  }

  getChatInfo(chatID: string): Observable<Chat> {
    return this.http.get<Chat>(`${this.baseUrl}/${chatID}`);
  }

  searchForUsers(loginSubstring: string): Observable<UserInfo[]> {
    return this.http.get<UserInfo[]>(`${this.searchForUsersUrl}/${loginSubstring}`);
  }

  createChat(chat: CreateChat): Observable<any> {
    return this.http.post(this.createChatUrl, chat);
  }
}
