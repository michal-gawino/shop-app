import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { UserService } from '../user.service';
import { User } from '../auth/user';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDividerComponent } from 'ng-zorro-antd/divider';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { CreateUpdateUserComponent } from '../create-update-user/create-update-user.component';
import { AuthService } from '../auth/auth.service';
import { PageRequest } from '../shared/models/page.request';
import { AsyncPipe } from '@angular/common';
import { startWith, Subject, switchMap, takeUntil } from 'rxjs';

@Component({
  selector: 'app-admin-users',
  imports: [
    NzTableModule,
    NzIconModule,
    NzDividerComponent,
    NzButtonModule,
    NzModalModule,
    AsyncPipe,
  ],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminUsersComponent implements OnInit, OnDestroy {
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private modalService = inject(NzModalService);

  currentUser!: User | null;
  formUser!: User;
  refreshSubject$ = new Subject<void>();
  users$ = this.refreshSubject$.pipe(
    startWith(0),
    switchMap(() => this.userService.findAll()),
  );

  constructor() {
    effect(() => {
      this.currentUser = this.authService.currentUser();
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.refreshSubject$.next();
    this.refreshSubject$.complete();
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
        this.refreshSubject$.next();
      },
    });
  }

  update(user: User) {
    this.userService.update(user).subscribe({
      next: (val) => {
        this.refreshSubject$.next();
      },
    });
  }
}
