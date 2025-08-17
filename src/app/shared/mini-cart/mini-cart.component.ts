import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, EventEmitter, Inject, Output, PLATFORM_ID, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../data/cart.service';
import { environment } from '../../../environments/environment';
import { buildWhatsAppOrderUrl } from '../whatsapp/whatsapp.utils';

@Component({
  selector: 'app-mini-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="mini-cart">
      <div class="top">
        <span class="title">Carrito</span>
        <button class="close" type="button" (click)="closed.emit()" aria-label="Cerrar">×</button>
      </div>
      <div class="items" *ngIf="cart.items().length; else empty">
        <div class="row" *ngFor="let it of cart.items().slice(0, 4)">
          <img [src]="it.product.images[0].small" alt="{{it.product.name}}" />
          <div class="meta">
            <div class="name">{{ it.product.name }}</div>
            <div class="line">{{ it.qty }} × {{ it.product.newPrice | currency:'USD' }}</div>
          </div>
          <button class="remove" (click)="remove(it.product.id)" aria-label="Quitar">×</button>
        </div>
        <div class="more" *ngIf="cart.items().length > 4">+ {{ cart.items().length - 4 }} más…</div>
        <div class="total">Total: <b>{{ cart.total() | currency:'USD' }}</b></div>
        <div class="actions">
          <a routerLink="/cart" class="btn">Ver carrito</a>
          <button type="button" class="btn primary" (click)="payViaWhatsApp()">Pagar</button>
        </div>
      </div>
      <ng-template #empty>
        <div class="empty">Tu carrito está vacío.</div>
      </ng-template>
    </div>
  `,
  styles: [`
    :host { display:block; }
  .mini-cart{ width: 320px; max-width: calc(100vw - 24px); background: var(--neutral-background); border: 1px solid rgba(255,255,255,.12); border-radius: 10px; box-shadow: 0 8px 24px rgba(0,0,0,.3); padding: 10px; color: inherit; }
  .top{ display:flex; align-items:center; justify-content:space-between; margin-bottom:6px; }
  .top .title{ font-weight:600; }
  .top .close{ background:none; border:none; font-size:18px; line-height:1; color:#666; cursor:pointer; }
    .row{ display:flex; align-items:center; gap:10px; padding:6px 0; }
  img{ width:48px; height:48px; object-fit:contain; background: var(--neutral-background); border:1px solid rgba(255,255,255,.06); border-radius:6px; }
    .meta{ flex:1; min-width:0; }
    .name{ font-size: 13px; line-height: 1.2; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .line{ font-size: 12px; color:#666; }
    .remove{ background:none; border:none; font-size:18px; line-height:1; color:#999; cursor:pointer; }
    .remove:hover{ color:#333; }
    .more{ font-size:12px; color:#666; text-align:center; padding:4px 0; }
    .total{ text-align:right; margin-top:8px; }
    .actions{ display:flex; gap:8px; justify-content:space-between; margin-top:10px; }
    .btn{ flex:1; display:inline-block; text-align:center; padding:8px 12px; border-radius:8px; border:1px solid rgba(255,255,255,.12); text-decoration:none; color:inherit; background: transparent; cursor: pointer; }
  .btn:hover{ border-color: rgba(255,255,255,.24); }
  .btn.primary{ background: var(--brand-primary); color: var(--brand-black); border-color: var(--brand-primary); }
  .btn.primary:hover{ filter: brightness(1.05); }
    .empty{ padding:8px; font-size: 13px; color:#666; text-align:center; }
  `]
})
export class MiniCartComponent {
  readonly cart = inject(CartService);
  @Output() closed = new EventEmitter<void>();
  remove(id: number){ this.cart.remove(id); }

  constructor(@Inject(PLATFORM_ID) private readonly platformId: Object) {}

  payViaWhatsApp() {
    if (!isPlatformBrowser(this.platformId)) return;
    const cfg = (environment as any)?.whatsapp ?? {};
    const items = this.cart.items();
    const total = this.cart.total();
    const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
    const url = buildWhatsAppOrderUrl(items, total, cfg, currentUrl);
    if (!url) return;
    try {
      window.open(url, '_blank', 'noopener');
      this.closed.emit();
    } catch {}
  }
}
