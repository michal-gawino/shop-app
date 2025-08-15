import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { LoginForm } from '../login/login-form';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { User } from './user';
import { Role } from '../shared/models/role';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private httpClient = inject(HttpClient);

  currentUser = signal<User | null>(null);

  constructor() {}

  login(loginForm: LoginForm): Observable<User> {
    return this.httpClient.post<User>(
      environment.apiUrl + '/auth/token',
      loginForm,
      {
        withCredentials: true,
      },
    );
  }

  logout(): Observable<void> {
    return this.httpClient.post<void>(
      environment.apiUrl + '/auth/logout',
      null,
      {
        withCredentials: true,
      },
    );
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

  getCurrentUser() {
    return this.httpClient.get<User>(environment.apiUrl + '/user/current', {
      withCredentials: true,
    });
  }

  isAuthenticated(): boolean {
    return this.currentUser() !== null;
  }

  setCurrentUser(user: User | null) {
    this.currentUser.set(user);
  }

  getCurrentUserValue(): User | null {
    return this.currentUser();
  }

  hasPermission(requiredRoles: Role[]): boolean {
    const hasRole = this.currentUser()?.roles.find((r) =>
      requiredRoles.includes(r),
    );
    return hasRole !== undefined;
  }
}
