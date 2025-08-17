import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, PLATFORM_ID, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductsService, Product, Category } from '../../shared/data/products.service';
import { UserListsService } from '../../shared/data/user-lists.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <section class="theme-container" style="padding:16px 0;">
      <h2 class="primary-text" style="margin:0 0 12px 0;">Productos</h2>
  <form class="filters" (submit)="$event.preventDefault()">
        <label class="field">
          Categoría
          <select [(ngModel)]="selectedCat" (ngModelChange)="applyFilters()" name="cat">
            <option [ngValue]="0">Todas</option>
            <option *ngFor="let c of categories()" [ngValue]="c.id">{{c.name}}</option>
          </select>
        </label>
        <div class="range">
          <label class="field">
            Precio mín.
            <input type="range" [attr.min]="priceMin" [attr.max]="priceMax" step="1" [(ngModel)]="minPrice" (ngModelChange)="syncRange('min')" name="minRange" />
            <input type="number" [min]="priceMin" [max]="priceMax" step="1" [(ngModel)]="minPrice" (ngModelChange)="syncRange('min')" name="minPrice" />
          </label>
          <label class="field">
            Precio máx.
            <input type="range" [attr.min]="priceMin" [attr.max]="priceMax" step="1" [(ngModel)]="maxPrice" (ngModelChange)="syncRange('max')" name="maxRange" />
            <input type="number" [min]="priceMin" [max]="priceMax" step="1" [(ngModel)]="maxPrice" (ngModelChange)="syncRange('max')" name="maxPrice" />
          </label>
        </div>
        <label class="field">
          Ordenar
          <select [(ngModel)]="sortBy" (ngModelChange)="applyFilters()" name="sort">
            <option [ngValue]="'relevance'">Relevancia</option>
            <option [ngValue]="'priceAsc'">Precio ↑</option>
            <option [ngValue]="'priceDesc'">Precio ↓</option>
            <option [ngValue]="'nameAsc'">Nombre A-Z</option>
            <option [ngValue]="'nameDesc'">Nombre Z-A</option>
          </select>
        </label>
      </form>
      <div class="grid" *ngIf="products().length; else loading">
        <div class="card light-block" *ngFor="let p of filtered()">
          <a [routerLink]="['/products', p.id]" class="media" style="text-decoration:none; color:inherit; display:block;">
            <img [src]="p.images[0].small" alt="{{p.name}}" />
          </a>
          <div class="meta">
            <a [routerLink]="['/products', p.id]" class="title" style="text-decoration:none; color:inherit;">{{ p.name }}</a>
            <div class="row between">
              <div class="price primary-text">{{ p.newPrice | currency:'USD' }}</div>
              <div class="actions">
                <button type="button" (click)="addWish(p)" title="Wishlist">♥</button>
                <button type="button" (click)="addCompare(p)" title="Comparar">⇄</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ng-template #loading>
        <div class="text-muted">Cargando productos…</div>
      </ng-template>
    </section>
  `,
  styles: [`
    .filters{
      display:flex; flex-wrap:wrap; gap: var(--space-3, 12px);
      align-items:flex-end; margin: 0 0 12px 0;
      padding: var(--space-3, 12px);
      background: var(--neutral-background);
      border:1px solid rgba(255,255,255,.08);
      border-radius:8px;
    }
    .filters .field{ display:flex; flex-direction:column; gap:6px; color: rgba(255,255,255,.85); }
    .filters .range{ display:flex; gap: var(--space-3, 12px); align-items:flex-end; flex-wrap:wrap; }
    .filters select,
    .filters input[type=number]{
      appearance: none;
      /* Forzamos esquema claro en el control para mejorar el popup nativo */
      color-scheme: light;
      background: var(--field-bg, #fff);
      color: var(--field-fg, #000);
      border:1px solid rgba(255,255,255,.18);
      border-radius:6px;
      padding:8px 10px;
      min-width: 160px;
    }
    /* Opciones del select (cuando el UA permite estilado) */
    .filters select option{ color: var(--field-fg, #000); background: var(--field-popup-bg, #fff); }
    .filters input[type=number]{ min-width: 110px; }
    .filters select:focus-visible,
    .filters input[type=number]:focus-visible{
      outline:2px solid var(--brand-primary);
      outline-offset:2px;
      border-color: var(--brand-primary);
    }
    .filters input[type=range]{
      width: 180px;
      accent-color: var(--brand-primary);
    }
    @media (max-width: 599px){
      .filters{ align-items:stretch; }
      .filters .field{ flex:1 1 100%; }
      .filters .range label.field{ flex:1 1 100%; }
      .filters input[type=range]{ width: 100%; }
      .filters select{ min-width: unset; width: 100%; }
    }
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
  /* normalized above */
  @supports not (aspect-ratio: 1 / 1){ .media img{ height:180px; } }
    .row.between{ display:flex; align-items:center; justify-content:space-between; }
  .actions{ display:flex; gap: var(--space-2, 8px); align-items:center; }
  .actions button{ background: var(--brand-primary); color: var(--on-primary, #000); border:none; border-radius:6px; padding:6px 8px; cursor:pointer; font-weight:600; transition: filter .15s ease-in-out; }
  .actions button:hover{ filter: brightness(.95); }
  .actions button:active,
  .actions button[aria-pressed="true"]{
  background: var(--neutral-pressed, #5a5a5a);
  background: color-mix(in srgb, var(--neutral-background), #fff 35%);
    color: #fff;
  }
  .actions button:focus-visible{ outline:2px solid var(--on-primary, #000); outline-offset:2px; }
  `]
})
export class ProductsListComponent implements OnInit {
  private readonly productsSvc = inject(ProductsService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly lists = inject(UserListsService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  protected products = signal<Product[]>([]);
  protected categories = signal<Category[]>([]);
  protected selectedCat = 0;
  protected maxPrice: number | null = null;
  protected minPrice: number | null = null;
  protected sortBy: 'relevance'|'priceAsc'|'priceDesc'|'nameAsc'|'nameDesc' = 'relevance';
  protected filtered = signal<Product[]>([]);
  protected priceMin = 0;
  protected priceMax = 0;

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Lee filtros desde query params al iniciar
      this.route.queryParamMap.subscribe((qp) => {
        const cat = Number(qp.get('cat') ?? '0');
        const min = qp.get('min');
        const max = qp.get('max');
        const sort = (qp.get('sort') ?? 'relevance') as typeof this.sortBy;
        // Valida sort
        const allowed: typeof this.sortBy[] = ['relevance','priceAsc','priceDesc','nameAsc','nameDesc'];
        this.sortBy = allowed.includes(sort) ? sort : 'relevance';
        this.selectedCat = Number.isFinite(cat) ? cat : 0;
        this.minPrice = min !== null ? Number(min) : this.minPrice;
        this.maxPrice = max !== null ? Number(max) : this.maxPrice;
        // Aplica si ya hay productos; si no, se aplicará tras la carga
        if (this.products().length) this.applyFilters(false);
      });
      this.productsSvc.getProducts().subscribe(p => {
        const list = p ?? [];
        this.products.set(list);
        this.priceMin = Math.floor(Math.min(...list.map(x => x.newPrice)) || 0);
        this.priceMax = Math.ceil(Math.max(...list.map(x => x.newPrice)) || 0);
        // Si no vienen en query params, inicializa por defecto
  this.minPrice ??= this.priceMin;
  this.maxPrice ??= this.priceMax;
        this.applyFilters(false);
      });
      this.productsSvc.getCategories().subscribe(c => this.categories.set(c ?? []));
    }
  // CSS-only equal-height layout via fixed media height + clamped title
  }

  applyFilters(updateQuery: boolean = true){
    const cat = this.selectedCat;
    const max = this.maxPrice;
    const min = this.minPrice;
    let list = [...this.products()];
    if (cat && cat > 0) list = list.filter(p => p.categoryId === cat);
    if (typeof min === 'number') list = list.filter(p => p.newPrice >= min);
    if (typeof max === 'number') list = list.filter(p => p.newPrice <= max);
    switch(this.sortBy){
      case 'priceAsc': list.sort((a,b)=>a.newPrice-b.newPrice); break;
      case 'priceDesc': list.sort((a,b)=>b.newPrice-a.newPrice); break;
      case 'nameAsc': list.sort((a,b)=>a.name.localeCompare(b.name)); break;
      case 'nameDesc': list.sort((a,b)=>b.name.localeCompare(a.name)); break;
      default: break;
    }
    this.filtered.set(list);
    if (updateQuery) this.syncQueryParams();
  }

  syncRange(which: 'min'|'max'){
    if (which === 'min' && typeof this.minPrice === 'number' && typeof this.maxPrice === 'number'){
      if (this.minPrice > this.maxPrice) this.maxPrice = this.minPrice;
    }
    if (which === 'max' && typeof this.minPrice === 'number' && typeof this.maxPrice === 'number'){
      if (this.maxPrice < this.minPrice) this.minPrice = this.maxPrice;
    }
    this.applyFilters();
  }

  addWish(p: Product){ this.lists.addToWishlist({ id:p.id, name:p.name, images:p.images, newPrice:p.newPrice }); }
  addCompare(p: Product){ this.lists.addToCompare({ id:p.id, name:p.name, images:p.images, newPrice:p.newPrice }); }

  // No JS layout calc needed

  private syncQueryParams(){
    const queryParams: Record<string, any> = {
      cat: this.selectedCat || null,
      min: typeof this.minPrice === 'number' ? this.minPrice : null,
      max: typeof this.maxPrice === 'number' ? this.maxPrice : null,
      sort: this.sortBy !== 'relevance' ? this.sortBy : null,
    };
    // Quita null para no ensuciar la URL
    Object.keys(queryParams).forEach(k => queryParams[k] === null && delete queryParams[k]);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }
}
