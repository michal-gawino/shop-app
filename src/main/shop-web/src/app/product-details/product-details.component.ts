import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { DatePipe, NgOptimizedImage } from '@angular/common';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { FormsModule } from '@angular/forms';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzCommentModule } from 'ng-zorro-antd/comment';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NavigationService } from '../navigation.service';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { ProductAvailability } from './product-availability';
import { Product } from '../shared/models/product.model';

@Component({
  selector: 'app-product-details',
  imports: [
    NzDescriptionsModule,
    NzCarouselModule,
    NgOptimizedImage,
    NzRateModule,
    FormsModule,
    NzTagModule,
    NzDividerModule,
    NzCommentModule,
    DatePipe,
    NzIconModule,
    NzButtonModule,
    NzProgressModule
  ],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
})
export class ProductDetailsComponent {
  private router = inject(Router);
  private navigationService = inject(NavigationService)
  ProductAvailability = ProductAvailability;
  product!: Product;


  constructor() {
    const navigation = this.router.getCurrentNavigation();
    this.product = navigation?.extras?.state?.data;

  }

  goBack() {
    this.navigationService.goBack();
  }
}
