import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { UserService } from '../user.service';
import { AsyncPipe } from '@angular/common';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { User } from '../auth/user';
import { NzListModule } from 'ng-zorro-antd/list';
import { AuthService } from '../auth/auth.service';
import { ChatService } from './chat.service';
import { ChatMessage, UserChatHistory } from '../shared/chat.model';
import moment from 'moment-timezone';
import { filter, firstValueFrom, map, Subscription, take } from 'rxjs';

@Component({
  selector: 'app-chat',
  imports: [
    FormsModule,
    NzButtonModule,
    NzInputModule,
    NzIconModule,
    NzSelectModule,
    AsyncPipe,
    NzAvatarModule,
    NzListModule,
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent implements OnInit, OnDestroy {
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private chatService = inject(ChatService);

  private textEncoder!: TextEncoder;
  private textDecorder!: TextDecoder;
  private chatSubscription: Subscription | undefined;

  users$ = this.userService.findAll();
  selectedUser!: User;
  loggedInUser: User | null = null;
  chatHistory!: UserChatHistory[];
  message: string = '';
  currentChat: UserChatHistory | undefined;

  ngOnInit(): void {
    this.textEncoder = new TextEncoder();
    this.textDecorder = new TextDecoder();
    this.chatService.getUserChatHistory().subscribe((chatHistory) => {
      this.chatHistory = chatHistory;
    });
    this.loggedInUser = this.authService.getCurrentUserValue();

    this.chatSubscription = this.chatService
      .watch('/user/queue/messages')
      .subscribe((message) => {
        const payload = JSON.parse(
          this.textDecorder.decode(message.binaryBody),
        ) as ChatMessage;
        const chat = this.chatHistory.find((c) => c.chatId === payload.chatId);
        if (chat === undefined) {
          this.createChat([payload]);
        } else {
          chat.messages.unshift(payload);
        }
      });
  }

  ngOnDestroy(): void {
    this.chatSubscription!.unsubscribe();
  }

  userChanged() {
    if (this.selectedUser !== null) {
      const user = this.chatHistory!.find(
        (u) => u.user.id === this.selectedUser!.id,
      );
      if (user === undefined) {
        this.createChat();
      }
    }
  }

  selectChatUser(user: User) {
    this.selectedUser = user;
    this.currentChat = this.chatHistory.find(
      (chat) => chat.user.id === this.selectedUser.id,
    );
  }

  async createChat(messages: ChatMessage[] = []) {
    var users, user, chatId;
    if (messages.length === 0) {
      users = [this.loggedInUser!.id!, this.selectedUser.id!];
      user = this.selectedUser;
      chatId = this.chatService.generateChatId(users);
    } else {
      users = messages.at(0)?.users;
      user = await firstValueFrom(
        this.users$.pipe(
          map((u) => u.find((x) => x.id === messages.at(0)!.senderId)),
        ),
      );
      chatId = messages.at(0)!.chatId;
    }
    const chat = {
      user: user!,
      chatId: chatId,
      messages: messages,
    };
    this.chatHistory.push(chat);
    this.currentChat = chat;
  }

  sendMessage(message: string) {
    const users = [this.loggedInUser!.id!, this.selectedUser!.id!];
    const chatId = this.chatService.generateChatId(users);
    const msg = {
      senderId: this.loggedInUser!.id,
      chatId: chatId,
      content: message,
      date: moment().toISOString(true),
      users: users,
    } as ChatMessage;
    if (message.trim().length !== 0) {
      this.chatService.publish({
        destination: `/app/chat/` + chatId,
        binaryBody: this.textEncoder.encode(JSON.stringify(msg)),
      });
      this.chatHistory = this.chatHistory.sort((x, y) => {
        const firstDate = Math.max(
          ...x.messages.map((m) => Date.parse(m.date)),
        );
        const secondDate = Math.max(
          ...y.messages.map((m) => Date.parse(m.date)),
        );
        return secondDate - firstDate;
      });
      this.message = '';
    }
  }
}
