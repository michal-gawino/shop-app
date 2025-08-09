import { Component, inject, OnInit } from '@angular/core';
import { ProductService } from '../search/product.service';
import { Product } from '../shared/models/product.model';
import { Page } from '../shared/models/page';
import { PageRequest } from '../shared/models/page.request';

@Component({
  selector: 'app-admin-products',
  imports: [],
  templateUrl: './admin-products.component.html',
  styleUrl: './admin-products.component.css',
})
export class AdminProductsComponent implements OnInit {
  private productService = inject(ProductService);
  pageRequest: PageRequest = { pageNumber: 0, size: 20 };
  
  products!: Page<Product>;

  ngOnInit(): void {
    this.productService.findAll(this.pageRequest).subscribe(products => {
      this.products = products;
    })
  }
}
