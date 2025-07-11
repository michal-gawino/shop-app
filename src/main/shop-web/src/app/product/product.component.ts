import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { Product } from './product.model';
import { ProductService } from './product.service';
import { Page } from '../shared/models/page';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { PageRequest } from '../shared/models/page.request';
import { SearchResponse } from '../shared/models/search.model';
import { NzSpinModule } from 'ng-zorro-antd/spin';

@Component({
  selector: 'app-product',
  imports: [
    CommonModule,
    FormsModule,
    NzIconModule,
    NzInputModule,
    NzButtonModule,
    NzCardModule,
    NgOptimizedImage,
    NzRateModule,
    NzPaginationModule,
    NzSpinModule
  ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css',
})
export class ProductComponent implements OnInit {
  private productService = inject(ProductService);

  response: SearchResponse<Product> | null = null;
  pageRequest: PageRequest = { pageNumber: 0, size: 20 };
  loading: boolean = true;

  ngOnInit(): void {
    this.getProducts();
  }

  pageChanged(pageNumber: number) {
    this.pageRequest.pageNumber = pageNumber - 1;
    this.getProducts();
  }

  numberOfItemsChanged(numberOfItems: number) {
    this.pageRequest.size = numberOfItems;
    this.getProducts();
  }

  getProducts(): void {
    this.productService.search(this.pageRequest).subscribe({
      next: (response) => {
        this.response = response;
        this.loading = false;
      },
    });
  }
}
