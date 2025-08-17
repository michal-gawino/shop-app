import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { AsyncPipe, DatePipe, NgOptimizedImage } from '@angular/common';
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
import {
  catchError,
  Observable,
  of,
  startWith,
  Subject,
  switchMap,
  tap,
} from 'rxjs';

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
    AsyncPipe,
  ],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private productService = inject(ProductService);
  private navigationService = inject(NavigationService);
  private reviewService = inject(ReviewService);
  private cartService = inject(CartService);

  ProductAvailability = ProductAvailability;
  id!: number;
  refreshSubject$ = new Subject<void>();
  product$!: Observable<Product | null>;
  review!: Review;
  currentUser!: User | null;
  reviewExists: boolean = false;
  productExists!: boolean;

  ngOnInit(): void {
    this.id = this.route.snapshot.params.id;
    this.product$ = this.refreshSubject$.pipe(
      startWith(void 0),
      switchMap(() =>
        this.productService.findOne(this.id).pipe(
          tap((product) => {
            this.clearReview();
            this.reviewExists =
              product.reviews.find(
                (r) => r.email === this.currentUser!.email,
              ) !== undefined;
          }),
          catchError((err) => {
            this.productExists = false;
            return of(null);
          }),
        ),
      ),
    );
    this.currentUser = this.authService.getCurrentUserValue();
  }

  addReview() {
    this.review = {
      reviewDate: new Date(),
      email: this.currentUser!.email,
      name: this.currentUser!.firstName.concat(' ', this.currentUser!.lastName),
      rating: this.review.rating,
      comment: this.review.comment,
    };
    this.reviewService.add(this.id, this.review).subscribe({
      next: () => {
        this.refreshSubject$.next();
      },
    });
  }

  deleteReview() {
    this.reviewService.delete(this.id).subscribe({
      next: () => {
        this.refreshSubject$.next();
      },
    });
  }

  clearReview() {
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

  ngOnDestroy(): void {
    this.refreshSubject$.next()
    this.refreshSubject$.complete();
  }
}
