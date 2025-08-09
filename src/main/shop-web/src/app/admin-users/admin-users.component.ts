import { Component, effect, inject, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { User } from '../auth/user';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDividerComponent } from 'ng-zorro-antd/divider';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { CreateUpdateUserComponent } from '../create-update-user/create-update-user.component';
import { AuthService } from '../auth/auth.service';
import { PaginationComponent } from '../pagination/pagination.component';
import { Page } from '../shared/models/page';
import { PageRequest } from '../shared/models/page.request';

@Component({
  selector: 'app-admin-users',
  imports: [
    NzTableModule,
    NzIconModule,
    NzDividerComponent,
    NzButtonModule,
    NzModalModule,
    PaginationComponent,
  ],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.css',
})
export class AdminUsersComponent implements OnInit {
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private modalService = inject(NzModalService);

  users!: Page<User>;
  currentUser!: User | null;
  formUser!: User;
  pageRequest: PageRequest = { pageNumber: 0, size: 20 };

  constructor() {
    effect(() => {
      this.currentUser = this.authService.currentUser();
    });
  }

  ngOnInit(): void {
    this.refreshUsers();
  }

  refreshUsers() {
    this.userService.findAll(this.pageRequest).subscribe((users) => {
      this.users = users;
    });
  }

  refreshView(pageRequest: PageRequest) {
    this.pageRequest = pageRequest;
    this.refreshUsers();
  }

  showCreateUpdateModal(user: User, create: boolean): void {
    this.formUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      roles: user.roles,
    };
    this.modalService.create({
      nzTitle: (create == true ? 'Create' : 'Update') + ' user',
      nzContent: CreateUpdateUserComponent,
      nzData: this.formUser,
      nzOnOk: () => this.update(this.formUser),
    });
  }

  showDeleteModal(userId: string): void {
    this.modalService.confirm({
      nzTitle: 'Are you sure you want to delete this user?',
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.deleteUser(userId),
      nzCancelText: 'No',
    });
  }

  deleteUser(userId: string): void {
    this.userService.delete(userId).subscribe({
      next: () => {
        this.refreshUsers();
      },
    });
  }

  update(user: User) {
    this.userService.update(user).subscribe({
      next: () => {
        this.refreshUsers();
      },
    });
  }
}
