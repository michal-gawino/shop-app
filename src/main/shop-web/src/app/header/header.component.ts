import { Component, effect, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { AuthService } from '../auth.service';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';

@Component({
  selector: 'app-header',
  imports: [NzIconModule, RouterLink, NzAvatarModule, NzMenuModule, NzDropDownModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  providers: []
})
export class HeaderComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  isAuthenticated: boolean = false;

  constructor() {
    effect(() => {
      this.isAuthenticated = this.authService.isAuthenticated();
      console.log('changing to' + this.authService.isAuthenticated());
    });
  }

  logout() {
    this.authService.setAuthenticated(false);
    this.router.navigate(['/login']);
  }
}
