import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Product } from './product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private httpClient = inject(HttpClient);

  findAllProductCategories() {
    return this.httpClient.get<Array<string>>(
      environment.apiUrl + '/product/category',
      {
        withCredentials: true
      }
    );
  }

  findBestRated(){
        return this.httpClient.get<Array<Product>>(
      environment.apiUrl + '/product/best-rated',
      {
        withCredentials: true
      }
    );
  }
}
