import { Injectable, PLATFORM_ID, computed, effect, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import type { Product } from './products.service';

export type SimpleProduct = Pick<Product, 'id' | 'name' | 'images' | 'newPrice'>;

@Injectable({ providedIn: 'root' })
export class UserListsService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  private readonly wishlistSig = signal<SimpleProduct[]>([]);
  private readonly compareSig = signal<SimpleProduct[]>([]);

  readonly wishlist = this.wishlistSig.asReadonly();
  readonly compare = this.compareSig.asReadonly();

  readonly wishlistCount = computed(() => this.wishlistSig().length);
  readonly compareCount = computed(() => this.compareSig().length);

  constructor() {
    if (this.isBrowser) {
      try {
        const w = localStorage.getItem('wishlist');
        if (w) this.wishlistSig.set(JSON.parse(w));
        const c = localStorage.getItem('compare');
        if (c) this.compareSig.set(JSON.parse(c));
      } catch {}
      effect(() => {
        localStorage.setItem('wishlist', JSON.stringify(this.wishlistSig()));
        localStorage.setItem('compare', JSON.stringify(this.compareSig()));
      });
    }
  }

  addToWishlist(p: SimpleProduct) {
    if (!this.wishlistSig().some(x => x.id === p.id)) {
      this.wishlistSig.update(list => [...list, p]);
    }
  }
  removeFromWishlist(id: number) {
    this.wishlistSig.update(list => list.filter(x => x.id !== id));
  }
  clearWishlist() { this.wishlistSig.set([]); }

  addToCompare(p: SimpleProduct) {
    if (!this.compareSig().some(x => x.id === p.id)) {
      this.compareSig.update(list => [...list, p]);
    }
  }
  removeFromCompare(id: number) {
    this.compareSig.update(list => list.filter(x => x.id !== id));
  }
  clearCompare() { this.compareSig.set([]); }
}
