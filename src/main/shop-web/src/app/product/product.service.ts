import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Product } from './product.model';
import { PageRequest } from '../shared/models/page.request';
import { SearchResponse } from '../shared/models/search.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private httpClient = inject(HttpClient);

  search(pageParams: PageRequest) {
    return this.httpClient.post<SearchResponse<Product>>(
      environment.apiUrl + '/product/search',
      {},
      {
        params: { page: pageParams.pageNumber, size: pageParams.size },
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
