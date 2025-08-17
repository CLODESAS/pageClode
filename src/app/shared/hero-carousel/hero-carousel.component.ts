import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, PLATFORM_ID, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { SmartTextOnImageDirective } from '../utils/smart-text.directive';

export type Slide = {
  title: string;
  subtitle?: string;
  image: string;
  ctaText?: string;
  url?: string;
};

@Component({
  selector: 'app-hero-carousel',
  standalone: true,
  imports: [CommonModule, RouterLink, SmartTextOnImageDirective],
  template: `
    <section class="hero" *ngIf="slides().length">
      <div class="viewport">
        <div class="track" [style.transform]="'translateX(' + (-index()*100) + '%)'"><!-- track wraps slides -->
      <ng-container *ngFor="let s of slides(); let i = index">
            <div class="slide" [class.active]="i === index()">
              <picture>
                <img [src]="s.image" [alt]="s.title" loading="eager" decoding="async" />
              </picture>
              <div class="mask"></div>
              <div class="copy theme-container">
                <h1>{{ s.title }}</h1>
                <h3 *ngIf="s.subtitle" class="text-muted" appSmartTextOnImage sampleRegion="bottom-left">{{ s.subtitle }}</h3>
                <a *ngIf="s.url" class="cta bg-primary" [routerLink]="s.url">{{ s.ctaText || 'Ver más' }}</a>
              </div>
            </div>
          </ng-container>
        </div>
      </div>
      <div class="controls theme-container">
        <button type="button" aria-label="Anterior" (click)="prev()">‹</button>
        <div class="dots">
          <button type="button" *ngFor="let s of slides(); let i = index" [class.on]="i===index()" (click)="go(i)" [attr.aria-label]="'Ir al slide ' + (i+1)"></button>
        </div>
        <button type="button" aria-label="Siguiente" (click)="next()">›</button>
      </div>
    </section>
  `,
  styles: [`
    .hero{ position:relative; }
    .viewport{ position:relative; overflow:hidden; }
    .track{ display:flex; transition: transform .5s ease; }
    .slide{ position:relative; min-width:100%; aspect-ratio: 16/6; }
  img{ width:100%; height:100%; object-fit:cover; display:block; }
  .mask{ position:absolute; inset:0; background: linear-gradient(180deg, rgba(0,0,0,.08) 0%, rgba(0,0,0,.35) 80%); }
    .copy{ position:absolute; inset:auto 0 10% 0; color:#fff; text-align:left; }
    .copy h1{ font-size:clamp(24px, 4.8vw, 48px); margin:0 0 8px; color: var(--brand-primary); }
  .copy h3{ font-size:clamp(16px, 2.4vw, 24px); margin:0 0 12px; }
  .copy h3.dark-text{ color:#000 !important; }
  .cta{ color: var(--on-primary, #000); background: var(--brand-primary); border:1px solid var(--brand-primary); text-decoration:none; padding:10px 14px; border-radius:6px; display:inline-block; transition: filter .15s ease-in-out; }
  .cta:hover{ filter: brightness(.95); }
  .cta:active,
  .cta[aria-pressed="true"]{ background: var(--neutral-pressed, #5a5a5a); background: color-mix(in srgb, var(--neutral-background), #fff 35%); color:#fff; border-color: transparent; }
    .controls{ display:flex; align-items:center; justify-content:space-between; gap:12px; position:absolute; inset:auto 0 8px 0; }
    .controls button{ background:rgba(0,0,0,.5); color:#fff; border:none; border-radius:6px; padding:6px 10px; cursor:pointer; }
    .dots{ display:flex; gap:6px; }
    .dots button{ width:10px; height:10px; border-radius:50%; border:none; background:rgba(255,255,255,.5); cursor:pointer; }
    .dots button.on{ background:#fff; }
    @media (max-width: 959px){ .slide{ aspect-ratio: 16/9; } }
  `]
})
export class HeroCarouselComponent implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly http = inject(HttpClient);
  protected slides = signal<Slide[]>([]);
  protected index = signal(0);
  private timer: any;

  ngOnInit(): void {
    // 1) Cargar desde assets JSON en navegador; 2) fallback a estáticos si falla
    if (isPlatformBrowser(this.platformId)) {
      this.http.get<Slide[]>(`/assets/data/hero-slides.json`).subscribe({
  next: (res) => this.slides.set((res?.length ?? 0) > 0 ? res : this.defaultSlides()),
        error: () => this.slides.set(this.defaultSlides())
      });
      this.start();
    } else {
      // En SSR no hacemos fetch; usamos estáticos para render inicial
      this.slides.set(this.defaultSlides());
    }
  }

  private defaultSlides(): Slide[] {
    return [
      { title: 'Equipos y Soluciones', subtitle: 'Para tu negocio', image: 'assets/images/banners/BannerCat1.png', url: '/products', ctaText: 'Explorar' },
      { title: 'Línea Industrial', subtitle: 'Rendimiento y calidad', image: 'assets/images/banners/BannerCat3.png', url: '/products', ctaText: 'Ver productos' },
      { title: 'Software & 3D', subtitle: 'Diseño y productividad', image: 'assets/images/banners/BannerCat6.png', url: '/products', ctaText: 'Cotizar' }
    ];
  }

  start(){ this.stop(); this.timer = setInterval(()=> this.next(), 6000); }
  stop(){ if (this.timer) clearInterval(this.timer); }
  next(){
    const len = this.slides().length;
    if (!len) return;
    this.index.set((this.index() + 1) % len);
  }
  prev(){
    const len = this.slides().length;
    if (!len) return;
    this.index.set((this.index() - 1 + len) % len);
  }
  go(i:number){ this.index.set(i); }
}
