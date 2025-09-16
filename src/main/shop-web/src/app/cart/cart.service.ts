import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Cart, CartItem } from './cart';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Product } from '../shared/models/product.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private httpClient = inject(HttpClient);
  private readonly EMPTY_CART = new Cart([]);
  private readonly CART_ENDPOINT = environment.apiUrl + '/cart';

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
    return this.httpClient.get<Cart>(this.CART_ENDPOINT, {
      withCredentials: true,
    });
  }

  addToCart(product: Product): Observable<void> {
    return this.httpClient.post<void>(
      this.CART_ENDPOINT + '/add',
      product,
      {
        withCredentials: true,
      },
    );
  }

  removeFromCart(product: Product): Observable<void> {
    return this.httpClient.delete<void>(
      this.CART_ENDPOINT + '/remove/' + product.id,
      {
        withCredentials: true,
      },
    );
  }

  editItem(item: CartItem): Observable<void> {
    return this.httpClient.put<void>(this.CART_ENDPOINT +'/edit', item, {
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
    this.cart().changeItemQuantity(item, quantity);
  }
}
