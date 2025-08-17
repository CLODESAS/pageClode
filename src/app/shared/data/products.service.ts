import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, of, shareReplay } from 'rxjs';

export type Product = {
  id: number;
  name: string;
  images: { small: string; medium: string; big: string }[];
  newPrice: number;
  categoryId?: number;
};

export type Category = {
  id: number;
  name: string;
  hasSubCategory?: boolean;
  parentId?: number;
};

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);

  private readonly cache = new Map<string, Observable<any>>();

  private getJson<T>(url: string, fallbackUrl?: string): Observable<T> {
    if (!isPlatformBrowser(this.platformId)) return of([] as unknown as T);
    const key = fallbackUrl ? `${url}|${fallbackUrl}` : url;
    if (this.cache.has(key)) return this.cache.get(key)! as Observable<T>;
    const req$ = this.http.get<T>(url);
    const final$ = fallbackUrl
      ? new Observable<T>((subscriber) => {
          req$.subscribe({
            next: (v) => {
              subscriber.next(v);
              subscriber.complete();
            },
            error: () => {
              this.http.get<T>(fallbackUrl).subscribe({
                next: (fv) => {
                  subscriber.next(fv);
                  subscriber.complete();
                },
                error: (e) => subscriber.error(e),
              });
            },
          });
        })
      : req$;
    const shared$ = final$.pipe(shareReplay({ bufferSize: 1, refCount: true }));
    this.cache.set(key, shared$);
    return shared$;
  }

  getFeaturedProducts() {
    return this.getJson<Product[]>(
      '/assets/data/featured-products.json',
      '/assets/data/products.json',
    );
  }

  getProducts() {
    return this.getJson<Product[]>('/assets/data/products.json');
  }

  getProductById(id: number) {
    return this.getProducts(); // simple for now; caller can filter by id
  }

  getCategories() {
    return this.getJson<Category[]>('/assets/data/categories.json');
  }

  // Brand demo dataset (used en páginas de marca)
  getBrandProducts() {
    return this.getJson<Product[]>('/assets/data/brand-products.json');
  }
}
