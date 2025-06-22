import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { LoginForm } from '../login/login-form';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { User } from './User';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private httpClient = inject(HttpClient);
  readonly AUTH_FLAG = 'auth';

  isLoggedIn = signal<boolean>(false);
  currentUser = signal<User | null>(null);

  constructor() {}

  login(loginForm: LoginForm): Observable<void> {
    return this.httpClient.post<void>(
      environment.apiUrl + '/auth/token',
      loginForm,
      {
        withCredentials: true,
      },
    );
  }

  logout() {
    return this.httpClient.post<void>(
      environment.apiUrl + '/auth/logout',
      null,
      {
        withCredentials: true,
      },
    );
  }

  getCurrentUser() {
    return this.httpClient.get<User>(environment.apiUrl + '/user', {
      withCredentials: true,
    });
  }

  setAuthenticated(value: boolean) {
    this.isLoggedIn.set(value);
    if (value) {
      localStorage.setItem(this.AUTH_FLAG, 'true');
    } else {
      localStorage.removeItem(this.AUTH_FLAG);
    }
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn() && localStorage.getItem(this.AUTH_FLAG) != null;
  }

  setCurrentUser(user: User | null) {
    this.currentUser.set(user);
  }
}
