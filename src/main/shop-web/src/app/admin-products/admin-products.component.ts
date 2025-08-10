import { Component, inject, OnInit } from '@angular/core';
import { ProductService } from '../search/product.service';
import { Product } from '../shared/models/product.model';
import { Page } from '../shared/models/page';
import { PageRequest } from '../shared/models/page.request';
import { PaginationComponent } from '../pagination/pagination.component';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTableComponent } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-admin-products',
  imports: [
    PaginationComponent,
    NzDividerModule,
    NzIconModule,
    NzTableComponent,
    NzButtonModule,
  ],
  templateUrl: './admin-products.component.html',
  styleUrl: './admin-products.component.css',
})
export class AdminProductsComponent implements OnInit {
  private productService = inject(ProductService);
  pageRequest: PageRequest = { pageNumber: 0, size: 20 };

  products!: Page<Product>;

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts(): void {
    this.productService.findAll(this.pageRequest).subscribe((products) => {
      this.products = products;
    });
  }

  refreshProducts(pageRequest: PageRequest) {
    this.pageRequest = pageRequest;
    this.getProducts();
  }
}
