import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { LoginForm } from '../login/login-form';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { User } from './user';
import { Router } from '@angular/router';
import { RegisterForm } from '../registration/register-form';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private httpClient = inject(HttpClient);
  private router = inject(Router);

  currentUser = signal<User | null>(null);

  constructor() {
    
  }

  login(loginForm: LoginForm): Observable<User> {
    return this.httpClient.post<User>(
      environment.apiUrl + '/auth/token',
      loginForm,
      {
        withCredentials: true,
      },
    );
  }

  logout() {
    this.setCurrentUser(null);
    this.router.navigate(['/login']);
  }

  refreshToken() {
    return this.httpClient.post<void>(
      environment.apiUrl + '/auth/refresh',
      null,
      {
        withCredentials: true,
      },
    );
  }

  register(registerForm: RegisterForm): Observable<void> {
    return this.httpClient.post<void>(
      environment.apiUrl + '/auth/register',
      registerForm,
    );
  }

  getCurrentUser() {
    return this.httpClient.get<User>(environment.apiUrl + '/user', {
      withCredentials: true,
    });
  }

  isAuthenticated(): boolean {
    return this.currentUser() != null;
  }

  setCurrentUser(user: User | null) {
    this.currentUser.set(user);
  }
}
