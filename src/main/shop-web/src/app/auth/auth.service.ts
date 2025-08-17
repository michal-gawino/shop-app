import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { LoginForm } from '../login/login-form';
import { environment } from '../../environments/environment.development';
import { Observable, tap } from 'rxjs';
import { User } from './user';
import { Role } from '../shared/models/role';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private httpClient = inject(HttpClient);
  private router = inject(Router);
  private readonly AUTH_ENDPOINT = environment.apiUrl + '/auth';

  currentUser = signal<User | null>(null);

  constructor() {}

  login(loginForm: LoginForm): Observable<User> {
    return this.httpClient.post<User>(
      this.AUTH_ENDPOINT + '/token',
      loginForm,
      {
        withCredentials: true,
      },
    );
  }

  logout(): Observable<void> {
    return this.httpClient.post<void>(this.AUTH_ENDPOINT + '/logout', null, {
      withCredentials: true,
    });
  }

  refreshToken() {
    return this.httpClient.post<void>(this.AUTH_ENDPOINT + '/refresh', null, {
      withCredentials: true,
    });
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

  logoutUser(): void {
    this.setCurrentUser(null);
    this.router.navigate(['/login']);
  }
}
