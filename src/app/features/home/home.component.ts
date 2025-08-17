import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, PLATFORM_ID, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BannersComponent } from '../../shared/banners/banners.component';
import { HeroCarouselComponent } from '../../shared/hero-carousel/hero-carousel.component';
import { RouterLink } from '@angular/router';

type Product = {
  id: number;
  name: string;
  images: { small: string; medium: string; big: string }[];
  newPrice: number;
};

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HeroCarouselComponent, BannersComponent, RouterLink],
  template: `
    <app-hero-carousel></app-hero-carousel>
    <app-banners></app-banners>
    <section class="theme-container" style="padding:16px 0;">
      <h2 class="primary-text" style="margin:0 0 12px 0;">Productos destacados</h2>
      <div class="grid" *ngIf="products().length; else loading">
        <a class="card light-block" *ngFor="let p of products()" [routerLink]="['/products', p.id]" style="text-decoration:none; color:inherit; display:block;">
            <div class="media"><img [src]="p.images[0].small" alt="{{p.name}}" /></div>
          <div class="meta">
            <div class="title">{{ p.name }}</div>
            <div class="price primary-text">{{ p.newPrice | currency:'USD' }}</div>
          </div>
        </a>
      </div>
      <ng-template #loading>
        <div class="text-muted">Cargando productos…</div>
      </ng-template>
    </section>
  `,
  styles: [`
  .grid{ display:grid; grid-template-columns: repeat(auto-fill,minmax(180px,1fr)); gap:12px; align-items:stretch; }
  .card{ padding:12px; background: var(--neutral-background); border:1px solid rgba(255,255,255,.08); border-radius:6px; display:flex; flex-direction:column; height:100%; }
  .media img{ width:100%; aspect-ratio: 4 / 3; object-fit:contain; background: var(--neutral-background); display:block; }
  .meta{ display:flex; flex-direction:column; gap:6px; margin-top:6px; }
  .meta .desc{ color: rgba(255,255,255,.65); }
  .title{ font-weight:700; color: var(--brand-primary); min-height:38px; line-height:1.2; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
  `]
})
export class HomeComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  protected products = signal<Product[]>([]);

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.http.get<Product[]>(`/assets/data/featured-products.json`).subscribe({
        next: (res) => this.products.set(res ?? []),
        error: () => this.http.get<Product[]>(`/assets/data/products.json`).subscribe(r => this.products.set(r ?? []))
      });
    }
  }
}
