import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Product } from './product';
import { Page } from './page';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private httpClient = inject(HttpClient);

  search() {
    return this.httpClient.post<Page<Product>>(
      environment.apiUrl + '/product/search',
      {

      },
      {
        withCredentials: true,
      },
    );
  }

  findAllProductCategories() {
    return this.httpClient.get<Array<string>>(
      environment.apiUrl + '/product/category',
      {
        withCredentials: true,
      },
    );
  }

  findBestRated() {
    return this.httpClient.get<Array<Product>>(
      environment.apiUrl + '/product/best-rated',
      {
        withCredentials: true,
      },
    );
  }
}
