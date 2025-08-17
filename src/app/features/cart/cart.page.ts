import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../shared/data/cart.service';
import { environment } from '../../../environments/environment';
import { buildWhatsAppOrderUrl } from '../../shared/whatsapp/whatsapp.utils';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="theme-container" style="padding:16px 0;">
      <h2 style="margin:0 0 16px;">Carrito</h2>
      <div *ngIf="cart.items().length; else empty">
        <div class="row" *ngFor="let it of cart.items()">
          <img [src]="it.product.images[0].small" alt="{{it.product.name}}" />
          <div class="grow">
            <div class="title">{{ it.product.name }}</div>
            <div class="price primary-text">{{ it.product.newPrice | currency:'USD' }}</div>
            <div class="controls">
              <button (click)="dec(it.product.id)">-</button>
              <span class="qty">{{ it.qty }}</span>
              <button (click)="inc(it.product.id)">+</button>
              <button class="link" (click)="remove(it.product.id)">Quitar</button>
            </div>
          </div>
        </div>
        <div class="total">Total: <b>{{ cart.total() | currency:'USD' }}</b></div>
        <div class="actions">
          <a routerLink="/products" class="btn">Seguir comprando</a>
          <button type="button" class="btn primary" (click)="payViaWhatsApp()">Pagar</button>
        </div>
      </div>
      <ng-template #empty>
        <div class="text-muted">Tu carrito está vacío. <a routerLink="/products">Ver productos</a></div>
      </ng-template>
    </section>
  `,
  styles: [`
  .row{ display:flex; gap:12px; padding:8px 0; border-bottom:1px solid rgba(255,255,255,.06); }
  img{ width:72px; height:72px; object-fit:contain; background: var(--neutral-background); border:1px solid rgba(255,255,255,.06); border-radius:6px; }
    .grow{ flex:1; display:flex; flex-direction:column; gap:6px; }
    .controls{ display:flex; align-items:center; gap:8px; }
    .controls button{ padding:2px 8px; }
  .controls .link{ background:none; border:none; color: var(--brand-primary); cursor:pointer; }
    .total{ text-align:right; margin:12px 0; }
    .actions{ display:flex; gap:8px; justify-content:flex-end; margin-top:10px; }
    .btn{ flex:0 0 auto; display:inline-block; text-align:center; padding:8px 12px; border-radius:8px; border:1px solid rgba(255,255,255,.12); text-decoration:none; color:inherit; background: transparent; cursor: pointer; }
  .btn:hover{ border-color: rgba(255,255,255,.24); }
  .btn.primary{ background: var(--brand-primary); color: var(--brand-black); border-color: var(--brand-primary); }
  .btn.primary:hover{ filter: brightness(1.05); }
  `]
})
export class CartPage {
  readonly cart = inject(CartService);
  constructor(@Inject(PLATFORM_ID) private readonly platformId: Object) {}
  inc(id: number){ const it = this.cart.items().find(x => x.product.id === id); if (it) this.cart.setQty(id, it.qty + 1); }
  dec(id: number){ const it = this.cart.items().find(x => x.product.id === id); if (it) this.cart.setQty(id, it.qty - 1); }
  remove(id: number){ this.cart.remove(id); }

  payViaWhatsApp(){
  if (!isPlatformBrowser(this.platformId)) return;
  const cfg = (environment as any)?.whatsapp ?? {};
  const items = this.cart.items();
  const total = this.cart.total();
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const url = buildWhatsAppOrderUrl(items, total, cfg, currentUrl);
  if (!url) return;
  try { window.open(url, '_blank', 'noopener'); } catch {}
  }
}
