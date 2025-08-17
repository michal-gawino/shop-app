import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from './auth/user';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment.development';
import { RegisterForm } from './registration/register-form';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private httpClient = inject(HttpClient);
  private readonly USER_ENDPOINT = environment.apiUrl + '/user';

  constructor() {}

  findAll(): Observable<Array<User>> {
    return this.httpClient.get<Array<User>>(this.USER_ENDPOINT, {
      withCredentials: true,
    });
  }

  update(user: User) {
    return this.httpClient.put<void>(this.USER_ENDPOINT, user, {
      withCredentials: true,
    });
  }

  delete(id: string): Observable<void> {
    return this.httpClient.delete<void>(this.USER_ENDPOINT + '/' + id, {
      withCredentials: true,
    });
  }

  register(registerForm: RegisterForm): Observable<void> {
    return this.httpClient.post<void>(
      this.USER_ENDPOINT + '/register',
      registerForm,
    );
  }
}
