import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { Product } from '../product';
import { ProductService } from '../product.service';
import { Page } from '../page';
import { NzRateModule } from 'ng-zorro-antd/rate';

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
    NzRateModule
  ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css',
})
export class ProductComponent implements OnInit {
  private productService = inject(ProductService);

  products: Page<Product> | null = null;

  ngOnInit(): void {
    this.productService.search().subscribe({
      next: (products) => {
        this.products = products;
      },
    });
  }
}
