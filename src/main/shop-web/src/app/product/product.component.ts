import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { Product, ProductView } from '../shared/models/product.model';
import { Router } from '@angular/router';

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
    NzSpinModule,
    NzCarouselModule,
  ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css',
})
export class ProductComponent {
  private router = inject(Router);

  view = input.required<ProductView>();
  product = input.required<Product>();
  ProductView = ProductView;

  selectProduct(product: Product) {
    this.router.navigate(['/product/' + product.id], {
      state: { data: product },
    });
  }
}
