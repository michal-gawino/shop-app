import { Component, effect, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
import { Product, Review } from '../shared/models/product.model';
import { NzFormModule } from 'ng-zorro-antd/form';
import { User } from '../auth/user';
import { AuthService } from '../auth/auth.service';
import { ReviewService } from '../review.service';
import { ProductService } from '../search/product.service';
import { NzAvatarComponent } from 'ng-zorro-antd/avatar';
import { CartService } from '../cart/cart.service';

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
    NzProgressModule,
    NzFormModule,
    NzCommentModule,
    NzAvatarComponent,
  ],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
})
export class ProductDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private productService = inject(ProductService);
  private navigationService = inject(NavigationService);
  private reviewService = inject(ReviewService);
  private cartService = inject(CartService);

  ProductAvailability = ProductAvailability;
  product!: Product;
  review!: Review;
  currentUser!: User | null;
  reviewExists: boolean = false;

  ngOnInit(): void {
    const productId = this.route.snapshot.params.id as number;
    this.loadProduct(productId);
    this.clearReview();
    this.currentUser = this.authService.getCurrentUserValue();
  }

  loadProduct(productId: number) {
    this.productService.findOne(productId).subscribe({
      next: (product) => {
        this.product = product;
        this.reviewExists =
          this.product.reviews.find(
            (r) => r.email === this.currentUser!.email,
          ) !== undefined;
      },
    });
  }

  addReview() {
    this.review.reviewDate = new Date();
    this.review.email = this.currentUser!.email;
    this.review.name = this.currentUser!.firstName.concat(
      ' ',
      this.currentUser!.lastName,
    );
    this.reviewService.add(this.product.id, this.review).subscribe({
      next: () => {
        this.reviewExists = true;
        this.product.reviews.push(this.review);
      },
    });
  }

  deleteReview() {
    this.reviewService.delete(this.product.id).subscribe({
      next: () => {
        this.loadProduct(this.product.id);
        this.clearReview();
      },
    });
  }

  clearReview() {
    this.reviewExists = false;
    this.review = { rating: 0, comment: '', email: '', name: '' };
  }

  goBack() {
    this.navigationService.goBack();
  }

  addToCart(product: Product) {
    const item = this.cartService.getItem(product.id);
    if (item !== undefined) {
      this.cartService
        .editItem({ product: product, quantity: item.quantity + 1 })
        .subscribe({
          next: () => {
            this.cartService.changeItemQuantity(item, item.quantity + 1);
          },
        });
    } else {
      this.cartService.addToCart(product).subscribe({
        next: (val) => {
          this.cartService.addItemToCart(product);
        },
      });
    }
  }
}
