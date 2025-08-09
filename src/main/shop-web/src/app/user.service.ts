import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from './auth/user';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment.development';
import { Page } from './shared/models/page';
import { PageRequest } from './shared/models/page.request';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private httpclient = inject(HttpClient);

  constructor() {}

  findAll(pageRequest: PageRequest): Observable<Page<User>> {
    return this.httpclient.get<Page<User>>(environment.apiUrl + '/user', {
      params: {page: pageRequest.pageNumber, size: pageRequest.size},
      withCredentials: true,
    });
  }

  update(user: User) {
    return this.httpclient.put<void>(environment.apiUrl + '/user', user, {
      withCredentials: true,
    });
  }

  delete(id: string): Observable<void> {
    return this.httpclient.delete<void>(environment.apiUrl + '/user/' + id, {
      withCredentials: true,
    });
  }
}
