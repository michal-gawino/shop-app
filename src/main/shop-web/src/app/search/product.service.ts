import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { PageRequest } from '../shared/models/page.request';
import { SearchRequest, SearchResponse } from '../shared/models/search.model';
import { Product } from '../shared/models/product.model';
import { Page } from '../shared/models/page';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private httpClient = inject(HttpClient);
  private readonly PRODUCT_ENDPOINT = environment.apiUrl + '/product';

  findOne(id: number) {
    return this.httpClient.get<Product>(this.PRODUCT_ENDPOINT + '/' + id, {
      withCredentials: true,
    });
  }

  findAll(pageRequest: PageRequest) {
    return this.httpClient.get<Page<Product>>(this.PRODUCT_ENDPOINT, {
      params: { page: pageRequest.pageNumber, size: pageRequest.size },
      withCredentials: true,
    });
  }

  findAllAsList(): Observable<Product[]> {
    return this.findAll({ pageNumber: 0, size: 10000 }).pipe(
      map((page) => page.content),
    );
  }

  search(pageParams: PageRequest, request: SearchRequest) {
    return this.httpClient.post<SearchResponse<Product>>(
      this.PRODUCT_ENDPOINT + '/search',
      request,
      {
        params: { page: pageParams.pageNumber, size: pageParams.size },
        withCredentials: true,
      },
    );
  }

  findAllProductCategories() {
    return this.httpClient.get<Array<string>>(
      this.PRODUCT_ENDPOINT + '/category',
      {
        withCredentials: true,
      },
    );
  }

  findBestRated() {
    return this.httpClient.get<Array<Product>>(
      this.PRODUCT_ENDPOINT + '/best-rated',
      {
        withCredentials: true,
      },
    );
  }
}
