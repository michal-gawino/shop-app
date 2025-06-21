import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { LoginForm } from './login/login-form';
import { environment } from '../environments/environment.development';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private httpClient = inject(HttpClient);
  private router = inject(Router);
  readonly AUTH_FLAG = 'auth';

  isLoggedInSignal = signal<boolean>(false);

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

  setAuthenticated(value: boolean) {
    this.isLoggedInSignal.set(value);
    if (value) {
      localStorage.setItem(this.AUTH_FLAG, 'true');
    } else {
      localStorage.removeItem(this.AUTH_FLAG);
    }
  }

  isAuthenticated(): boolean {
    return (
      this.isLoggedInSignal() && localStorage.getItem(this.AUTH_FLAG) != null
    );
  }
}
