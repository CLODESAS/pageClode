import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductsService, Product } from '../../shared/data/products.service';

@Component({
  selector: 'app-brand-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
  <section class="theme-container" style="padding:16px 0;">
    <a routerLink="/brands" class="back">← Volver a marcas</a>
    <h2 class="primary-text" style="margin:8px 0 12px 0; text-transform:capitalize;">{{ brandName }}</h2>
    <div class="grid" *ngIf="products().length; else loading">
      <div class="card light-block" *ngFor="let p of products()">
        <a [routerLink]="['/products', p.id]" class="media" style="text-decoration:none; color:inherit; display:block;">
          <img [src]="p.images[0].small" alt="{{p.name}}" />
        </a>
        <div class="meta">
          <a [routerLink]="['/products', p.id]" class="title" style="text-decoration:none; color:inherit;">{{ p.name }}</a>
          <div class="row between">
            <div class="price primary-text">{{ p.newPrice | currency:'USD' }}</div>
          </div>
        </div>
      </div>
    </div>
    <ng-template #loading>
      <div class="text-muted">Cargando productos de la marca…</div>
    </ng-template>
  </section>
  `,
  styles: [`
    .grid{ display:grid; gap:16px; grid-template-columns: 1fr; }
    @media (min-width: 600px){ .grid{ grid-template-columns: repeat(2, 1fr); } }
    @media (min-width: 1280px){ .grid{ grid-template-columns: repeat(3, 1fr); } }
    .title{ font-weight:700; color: var(--brand-primary); min-height:40px; line-height:1.2; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
    .meta .desc, .meta .category{ color: rgba(255,255,255,.65); }
    .card{ padding:12px; background: var(--neutral-background); border:1px solid rgba(255,255,255,.08); border-radius:6px; display:flex; flex-direction:column; height:100%; box-sizing:border-box; }
    .media{ width:100%; height:220px; display:block; }
    .media img{ width:100%; height:100%; object-fit:contain; background: var(--neutral-background); display:block; }
    @media (max-width: 959px){ .media{ height:180px; } }
    @media (max-width: 599px){ .media{ height:150px; } }
    .meta{ display:flex; flex-direction:column; gap:8px; margin-top:8px; }
    @supports not (aspect-ratio: 1 / 1){ .media img{ height:180px; } }
    .row.between{ display:flex; align-items:center; justify-content:space-between; }
    .back{ text-decoration:none; color: rgba(255,255,255,.65); }
  `]
})
export class BrandDetailPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly productsSvc = inject(ProductsService);

  protected brandName = '';
  protected products = signal<Product[]>([]);

  ngOnInit(): void {
    this.route.paramMap.subscribe(pm => {
      this.brandName = pm.get('name') || '';
      this.productsSvc.getBrandProducts().subscribe(list => this.products.set(list ?? []));
    });
  }
}
