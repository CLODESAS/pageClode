import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, PLATFORM_ID, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductsService } from '../../shared/data/products.service';
import type { Product } from '../../shared/data/products.service';
import { CartService } from '../../shared/data/cart.service';
import { UserListsService } from '../../shared/data/user-lists.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    @if (product(); as prod) {
    <section class="theme-container" style="padding:16px 0;">
      <a routerLink="/products" class="text-muted" style="text-decoration:none;">← Volver</a>
      <div class="detail">
        <img [src]="prod.images[0].big || prod.images[0].medium || prod.images[0].small" alt="{{prod.name}}" />
        <div class="info">
          <h1 class="title">{{ prod.name }}</h1>
          <div class="price primary-text">{{ prod.newPrice | currency:'USD' }}</div>
          <div class="buttons">
            <button class="mat-mdc-raised-button mat-primary" (click)="addToCart()">Agregar al carrito</button>
            <button class="mat-mdc-outlined-button" (click)="addWish()" title="Wishlist">♥</button>
            <button class="mat-mdc-outlined-button" (click)="addCompare()" title="Comparar">⇄</button>
          </div>
        </div>
      </div>
    </section>
    } @else {
      <section class="theme-container" style="padding:16px 0;">
        <div class="text-muted">Cargando…</div>
      </section>
    }
  `,
  styles: [`
    .detail{ display:grid; grid-template-columns: 1fr 1fr; gap:24px; align-items:start; }
  img{ width:100%; max-height:420px; object-fit:contain; background: var(--neutral-background); border:1px solid rgba(255,255,255,.06); border-radius:8px; }
  .title{ margin:0 0 12px; color: var(--brand-primary); font-weight:700; }
  .info{ display:flex; flex-direction:column; gap:12px; }
  .buttons{ display:flex; gap:8px; }
  .buttons .mat-mdc-raised-button,
  .buttons .mat-mdc-outlined-button{
    background: var(--brand-primary);
    color: var(--on-primary, #000);
    border: none;
    border-radius: 6px;
    padding: 8px 12px;
    font-weight:600;
    transition: filter .15s ease-in-out;
  }
  .buttons .mat-mdc-outlined-button{ border:none; }
  .buttons .mat-mdc-raised-button:hover,
  .buttons .mat-mdc-outlined-button:hover{ filter: brightness(.95); }
  .buttons .mat-mdc-raised-button:active,
  .buttons .mat-mdc-outlined-button:active,
  .buttons .mat-mdc-raised-button[aria-pressed="true"],
  .buttons .mat-mdc-outlined-button[aria-pressed="true"]{
  background: var(--neutral-pressed, #5a5a5a);
  background: color-mix(in srgb, var(--neutral-background), #fff 35%);
    color:#fff;
  }
  .buttons .mat-mdc-raised-button:focus-visible,
  .buttons .mat-mdc-outlined-button:focus-visible{ outline:2px solid var(--on-primary, #000); outline-offset:2px; }
    @media (max-width: 800px){ .detail{ grid-template-columns: 1fr; } }
  `]
})
export class ProductDetailComponent implements OnInit {
  private readonly productsSvc = inject(ProductsService);
  private readonly cart = inject(CartService);
  private readonly lists = inject(UserListsService);
  private readonly ar = inject(ActivatedRoute);
  private readonly platformId = inject(PLATFORM_ID);
  protected product = signal<Product | null>(null);

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const id = Number(this.ar.snapshot.paramMap.get('id'));
    if (!Number.isFinite(id)) return;
    this.productsSvc.getProducts().subscribe((list) => {
      const products = list ?? [];
      const p = products.find((x) => x.id === id) || null;
      this.product.set(p);
    });
  }

  addToCart() {
  const p = this.product() as Product | null;
  if (!p) return;
  this.cart.add(p, 1);
  }

  addWish(){ const p = this.product(); if (p) this.lists.addToWishlist({ id:p.id, name:p.name, images:p.images, newPrice:p.newPrice }); }
  addCompare(){ const p = this.product(); if (p) this.lists.addToCompare({ id:p.id, name:p.name, images:p.images, newPrice:p.newPrice }); }
}
