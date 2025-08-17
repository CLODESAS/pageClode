import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../data/cart.service';
import { UserListsService } from '../data/user-lists.service';
import { MiniCartComponent } from '../mini-cart/mini-cart.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, MiniCartComponent],
  template: `
    <header class="theme-container header">
      <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }" class="brand">Home</a>
      <nav class="nav" aria-label="Navegación principal">
        <a routerLink="/products" routerLinkActive="active" class="link">Productos</a>
  <a routerLink="/brands" routerLinkActive="active" class="link">Marcas</a>
  <a routerLink="/wishlist" class="link icon" title="Wishlist" aria-label="Wishlist">
          ♥ @if (lists.wishlistCount()) { <span class="badge" aria-label="Productos en wishlist">{{ lists.wishlistCount() }}</span> }
  </a>
  <a routerLink="/compare" class="link icon" title="Comparar" aria-label="Comparar">
          ⇄ @if (lists.compareCount()) { <span class="badge" aria-label="Productos para comparar">{{ lists.compareCount() }}</span> }
  </a>
  <button type="button" class="link icon" aria-haspopup="dialog" [attr.aria-expanded]="showMini()" (click)="showMini.set(!showMini())" (keydown.enter)="showMini.set(!showMini())" (keydown.space)="$event.preventDefault(); showMini.set(!showMini())" (mouseenter)="showMini.set(true)">
          🛒 @if (cart.count()) { <span class="badge" aria-label="Artículos en el carrito">{{ cart.count() }}</span> }
        </button>
      </nav>
      @if (showMini()) {
        <div class="mini-layer" role="dialog" aria-label="Resumen del carrito">
          <app-mini-cart (closed)="showMini.set(false)" />
        </div>
      }
    </header>
  `,
  styles: [`
    :host { display:block; position:relative; }
    .header{ display:flex; align-items:center; justify-content:space-between; padding:8px 0; position:relative; }
  .brand{ text-decoration:none; font-weight:700; color: var(--brand-primary); padding:6px 10px; border-radius:10px; transition: box-shadow .15s ease, background .2s ease; }
  .nav{ display:flex; gap:16px; align-items:center; }
  .link{ text-decoration:none; color:inherit; padding:6px 10px; border-radius:10px; transition: box-shadow .15s ease, background .2s ease; }
  /* Contorno suavizado al hover/focus */
  .link:hover, .brand:hover { box-shadow: 0 0 0 2px rgba(255,255,255,.18); }
  .link:focus-visible, .brand:focus-visible { box-shadow: 0 0 0 3px rgba(255,255,255,.24); outline: none; }
  /* Estado activo (gris neutro) cuando la ruta coincide o al presionar */
  .link.active, .brand.active { background: rgba(255,255,255,.12); box-shadow: none; }
  .link:active, .brand:active { background: rgba(255,255,255,.18); }
  .link.icon{ background:none; border:none; cursor:pointer; }
  .badge{ background: var(--brand-primary); color:#000; border-radius:10px; padding:0 6px; font-size:12px; margin-left:4px; }
    .mini-layer{ position:absolute; right:0; top:100%; margin-top:8px; z-index:30; }
  `]
})
export class HeaderComponent {
  readonly cart = inject(CartService);
  readonly lists = inject(UserListsService);
  readonly showMini = signal(false);
  private readonly host = inject(ElementRef<HTMLElement>);

  // Cierra al hacer click fuera del header/mini-cart
  @HostListener('document:click', ['$event'])
  onDocClick(event: MouseEvent){
    if (!this.showMini()) return;
    const el = this.host.nativeElement;
    const target = event.target as Node | null;
    if (target && !el.contains(target)) this.showMini.set(false);
  }

  // Cierra con ESC
  @HostListener('document:keydown.escape')
  onEsc(){ if (this.showMini()) this.showMini.set(false); }
}
