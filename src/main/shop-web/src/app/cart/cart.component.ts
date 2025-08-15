import { Component, effect, inject } from '@angular/core';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { CartService } from './cart.service';
import { Cart, CartItem } from './cart';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { FormsModule } from '@angular/forms';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-cart',
  imports: [
    NzEmptyModule,
    NzListModule,
    NzRateModule,
    FormsModule,
    NzInputNumberModule,
    NzDividerModule,
    NzButtonModule,
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent {
  private cartService = inject(CartService);
  cart!: Cart;

  constructor() {
    effect(() => {
      this.cart = this.cartService.getCart();
    });
  }

  removeItem(item: CartItem) {
    this.cartService.removeFromCart(item.product).subscribe({
      next: () => {
        this.cart.removeItem(item);
      },
    });
  }

  editItem(
    event: { value: number; offset: number; type: 'up' | 'down' },
    item: CartItem,
  ) {
    this.cartService
      .editItem({ quantity: event.value, product: item.product })
      .subscribe({
        next: () => {
          this.cart.changeItemQuantity(item, event.value);
        },
      });
  }
}
