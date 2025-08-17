import { Injectable, PLATFORM_ID, computed, effect, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import type { Product } from './products.service';

export type CartItem = { product: Product; qty: number };

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  private readonly itemsSig = signal<CartItem[]>([]);
  readonly items = this.itemsSig.asReadonly();
  readonly count = computed(() => this.itemsSig().reduce((a, c) => a + c.qty, 0));
  readonly total = computed(() => this.itemsSig().reduce((a, c) => a + (c.product.newPrice * c.qty), 0));

  constructor() {
    if (this.isBrowser) {
      // hydrate from storage
      try {
        const raw = localStorage.getItem('cart');
        if (raw) this.itemsSig.set(JSON.parse(raw));
      } catch {}
      // persist on change
      effect(() => {
        const data = JSON.stringify(this.itemsSig());
        try { localStorage.setItem('cart', data); } catch {}
      });
    }
  }

  add(product: Product, qty = 1) {
    const arr = this.itemsSig().slice();
    const i = arr.findIndex(x => x.product.id === product.id);
    if (i >= 0) arr[i] = { product: arr[i].product, qty: arr[i].qty + qty };
    else arr.push({ product, qty });
    this.itemsSig.set(arr);
  }

  setQty(productId: number, qty: number) {
    const arr = this.itemsSig().slice();
    const i = arr.findIndex(x => x.product.id === productId);
    if (i >= 0) {
      if (qty <= 0) arr.splice(i, 1);
      else arr[i] = { product: arr[i].product, qty };
      this.itemsSig.set(arr);
    }
  }

  remove(productId: number) {
    this.itemsSig.set(this.itemsSig().filter(x => x.product.id !== productId));
  }

  clear() { this.itemsSig.set([]); }
}
