import { Component, inject, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { Product } from '../product';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { NgOptimizedImage } from '@angular/common';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-home',
  imports: [NzDividerModule, NzTagModule, NzCarouselModule, NgOptimizedImage, NzRateModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  private productService = inject(ProductService);
  categories: Array<string> = [];
  products: Array<Product> | null = null;

  ngOnInit(): void {
    this.productService.findAllProductCategories().subscribe({
      next: (categories) => (this.categories = categories),
    });
    this.productService.findBestRated().subscribe({
      next: (products) => this.products = products,
    })
  }

  selectCategory(category: string) {
    console.log(category);
  }
}
