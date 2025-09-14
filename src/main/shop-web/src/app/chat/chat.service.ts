import { inject, Injectable } from '@angular/core';
import { RxStomp } from '@stomp/rx-stomp';
import { websocketFactory } from '../websocket.config';
import { sha256 } from 'js-sha256';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserChatHistory } from '../shared/chat.model';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
  useFactory: websocketFactory,
})
export class ChatService extends RxStomp {
  private httpClient = inject(HttpClient);
  private readonly MESSAGE_ENDPOINT = environment.apiUrl + '/message';

  constructor() {
    super();
  }

  generateChatId(users: string[]) {
    const chatId = users.sort().join();
    return sha256(chatId);
  }

  getUserChatHistory(): Observable<UserChatHistory[]> {
    return this.httpClient.get<UserChatHistory[]>(this.MESSAGE_ENDPOINT, {
      withCredentials: true,
    });
  }
}
