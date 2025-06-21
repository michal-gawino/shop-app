import { Component, inject } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { AuthService } from '../auth.service';
import { LoginForm } from './login-form';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NzAlertModule } from 'ng-zorro-antd/alert';

@Component({
  selector: 'app-login',
  imports: [
    NzButtonModule,
    NzCheckboxModule,
    NzFormModule,
    NzInputModule,
    FormsModule,
    NzAlertModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm: LoginForm = { username: '', password: '' };
  displayErrorMessage = false;

  ngOnInit() {}

  login() {
    this.authService
      .login({
        username: this.loginForm.username,
        password: this.loginForm.password,
      })
      .subscribe({
        next: (res) => {
          this.authService.setAuthenticated(true);
          this.router.navigate(['/home']);
        },
        error: (err) => {
          this.displayErrorMessage = true;
        },
      });
  }
}
