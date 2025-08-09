import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { PageRequest } from '../shared/models/page.request';
import { SearchRequest, SearchResponse } from '../shared/models/search.model';
import { Product } from '../shared/models/product.model';
import { Page } from '../shared/models/page';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private httpClient = inject(HttpClient);

  findAll(pageRequest: PageRequest) {
    return this.httpClient.get<Page<Product>>(environment.apiUrl + '/product', {
      params: {page: pageRequest.pageNumber, size: pageRequest.size},
      withCredentials: true,
    });
  }

  search(pageParams: PageRequest, request: SearchRequest) {
    return this.httpClient.post<SearchResponse<Product>>(
      environment.apiUrl + '/product/search',
      request,
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
