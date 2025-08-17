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
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { Cart } from '../cart/cart';
import { CartService } from '../cart/cart.service';

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
    NzModalModule,
    NzBadgeModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  providers: [],
})
export class HeaderComponent {
  private authService = inject(AuthService);
  private cartService = inject(CartService);
  private modalService = inject(NzModalService);

  currentUser: User | null = null;
  cart!: Cart;

  constructor() {
    effect(() => {
      this.currentUser = this.authService.currentUser();
      this.cart = this.cartService.getCart();
    });
  }

  isAdmin() {
    return this.authService.hasPermission([Role.ADMIN]);
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.authService.logoutUser();
      },
    });
  }

  openUploadModal() {
    this.modalService.create({
      nzTitle: 'Upload avatar',
      nzContent: UploadAvatarComponent,
      nzFooter: null,
    });
  }
}
