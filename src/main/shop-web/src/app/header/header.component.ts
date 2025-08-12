import { Component, effect, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { AuthService } from '../auth/auth.service';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { User } from '../auth/user';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { Role } from '../shared/models/role';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { UploadAvatarComponent } from '../upload-avatar/upload-avatar.component';

@Component({
  selector: 'app-header',
  imports: [
    NzIconModule,
    RouterLink,
    NzAvatarModule,
    NzMenuModule,
    NzDropDownModule,
    NzButtonModule,
    NzSpinModule,
    NzUploadModule,
    NzToolTipModule,
    NzModalModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  providers: [],
})
export class HeaderComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private modalService = inject(NzModalService)

  currentUser: User | null = null;

  constructor() {
    effect(() => {
      this.currentUser = this.authService.currentUser();
    });
  }

  isAdmin() {
    return this.authService.hasPermission([Role.ADMIN]);
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.authService.setCurrentUser(null);
        this.router.navigate(['/login']);
      },
    });
  }

  openUploadModal() {
    this.modalService.create({
      nzTitle: 'Upload avatar',
      nzContent: UploadAvatarComponent,
      nzFooter: null
    });
  }

}
