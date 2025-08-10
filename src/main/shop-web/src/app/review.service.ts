import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment.development';
import { Review } from './shared/models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private httpclient = inject(HttpClient);

  constructor() {}

  add(productId: number, review: Review): Observable<void> {
    return this.httpclient.post<void>(environment.apiUrl + '/review', review, {
      params: { productId: productId },
      withCredentials: true,
    });
  }

  delete(productId: number): Observable<void> {
    return this.httpclient.delete<void>(environment.apiUrl + '/review', {
      params: { productId: productId },
      withCredentials: true,
    });
  }
}
