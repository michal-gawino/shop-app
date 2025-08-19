import { Component, inject } from '@angular/core';
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
export class ChatComponent {
  private userService = inject(UserService);

  users$ = this.userService.findAll();
  selectedUser!: User;
  chatUser: User | null = null;
  usersHistory = new Array<User>();

  userChanged() {
    if (this.selectedUser !== null) {
      const user = this.usersHistory.find(
        (u) => u.id === this.selectedUser!.id,
      );
      if (user === undefined) {
        this.usersHistory.push(this.selectedUser);
      }
      this.chatUser = this.selectedUser;
    }
  }

  selectChatUser(user: User) {
    this.chatUser = user;
  }
}
