import { Component, effect, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { AuthService } from '../auth/auth.service';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { User } from '../auth/User';
import { NzSpinModule } from 'ng-zorro-antd/spin';

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
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  providers: [],
})
export class HeaderComponent {
  private authService = inject(AuthService);

  currentUser: User | null = null;
  isAuthenticated: boolean = false;
  isLoading: boolean = false;

  constructor() {
    effect(() => {
      this.isAuthenticated = this.authService.isAuthenticated();
      this.currentUser = this.authService.currentUser();
    });
  }

  logout() {
    this.authService.logout();
  }

  getCurrentUser() {
    if (this.currentUser === null) {
      this.isLoading = true;
      this.authService.getCurrentUser().subscribe({
        next: (user) => {
          this.authService.setCurrentUser(user);
          this.isLoading = false;
        },
      });
    }
  }

  refresh() {
    this.authService.refreshToken().subscribe();
  }
}
