import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Cart, CartItem } from './cart';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Product } from '../shared/models/product.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private httpClient = inject(HttpClient);
  private readonly EMPTY_CART = new Cart([]);

  cart = signal<Cart>(this.EMPTY_CART);

  constructor() {
    this.init();
  }

  init() {
    this.getUserCart().subscribe({
      next: (cart) => {
        const items = cart === null ? [] : cart.items;
        this.cart.set(new Cart(items));
      },
    });
  }

  getUserCart(): Observable<Cart> {
    return this.httpClient.get<Cart>(environment.apiUrl + '/cart', {
      withCredentials: true,
    });
  }

  addToCart(product: Product): Observable<void> {
    return this.httpClient.post<void>(
      environment.apiUrl + '/cart/add',
      product,
      {
        withCredentials: true,
      },
    );
  }

  removeFromCart(product: Product): Observable<void> {
    return this.httpClient.delete<void>(
      environment.apiUrl + '/cart/remove/' + product.id,
      {
        withCredentials: true,
      },
    );
  }

  editItem(item: CartItem): Observable<void> {
    return this.httpClient.put<void>(environment.apiUrl + '/cart/edit', item, {
      withCredentials: true,
    });
  }

  addItemToCart(product: Product) {
    this.cart().addItem(product);
  }

  getCart(): Cart {
    return this.cart();
  }

  getItem(id: number): CartItem | undefined {
    return this.cart().getItem(id);
  }

    changeItemQuantity(item: CartItem, quantity: number) {
      this.cart().changeItemQuantity(item, quantity)
  }
}
