import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Review } from './shared/models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private httpclient = inject(HttpClient);
  private readonly REVIEW_ENDPOINT = environment.apiUrl + '/review';

  constructor() {}

  add(productId: number, review: Review): Observable<void> {
    return this.httpclient.post<void>(this.REVIEW_ENDPOINT, review, {
      params: { productId: productId },
      withCredentials: true,
    });
  }

  delete(productId: number): Observable<void> {
    return this.httpclient.delete<void>(this.REVIEW_ENDPOINT, {
      params: { productId: productId },
      withCredentials: true,
    });
  }
}
