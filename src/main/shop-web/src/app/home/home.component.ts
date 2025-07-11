import { Component, inject, OnInit } from '@angular/core';
import { ProductService } from '../product/product.service';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { NgOptimizedImage } from '@angular/common';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { FormsModule } from '@angular/forms';
import { Router  } from '@angular/router';
import { Product } from '../product/product.model';

@Component({
  selector: 'app-home',
  imports: [
    NzDividerModule,
    NzTagModule,
    NzCarouselModule,
    NgOptimizedImage,
    NzRateModule,
    FormsModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  private productService = inject(ProductService);
  private router = inject(Router);

  categories: Array<string> = [];
  products: Array<Product> | null = null;

  ngOnInit(): void {
    this.productService.findAllProductCategories().subscribe({
      next: (categories) => (this.categories = categories),
    });
    this.productService.findBestRated().subscribe({
      next: (products) => (this.products = products),
    });
  }

  selectCategory(category: string) {
    console.log(category);
  }

  selectProduct(product: Product) {
    this.router.navigate(['/product/' + product.id], {
      state: { data: product },
    });
  }
}
