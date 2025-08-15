import { Product } from '../shared/models/product.model';

export interface CartItem {
  product: Product;
  quantity: number;
}

export class Cart {
  items: Array<CartItem> = [];

  constructor(items: Array<CartItem>) {
    this.items = items;
  }

  addItem(product: Product) {
    const item = this.getItem(product.id);
    if (item !== undefined) {
      this.changeItemQuantity(item, item.quantity + 1);
    } else {
      this.items.push({ quantity: 1, product: product });
    }
  }

  changeItemQuantity(item: CartItem, quantity: number) {
    item.quantity = quantity;
  }

  getItem(id: number): CartItem | undefined {
    return this.items.find((p) => p.product.id === id);
  }

  getTotalValue() {
    return this.items
      .map((i) => i.quantity * i.product.price)
      .reduce((prev, next, idx) => {
        return prev + next;
      })
      .toFixed(2);
  }

  removeItem(item: CartItem) {
    const idx = this.items.indexOf(item);
    this.items.splice(idx, 1);
  }
}
