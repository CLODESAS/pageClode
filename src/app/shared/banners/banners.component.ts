import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, PLATFORM_ID, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SmartTextOnImageDirective } from '../utils/smart-text.directive';

export type Banner = {
  title: string;
  subtitle?: string;
  image?: string;
  url?: string;
};

@Component({
  selector: 'app-banners',
  standalone: true,
  imports: [CommonModule, RouterLink, SmartTextOnImageDirective],
  template: `
    <section class="theme-container" *ngIf="banners().length" style="padding:8px 0 0;">
      <div class="banners-grid">
        <ng-container *ngFor="let b of banners(); let i = index">
          <a *ngIf="!isExternal(b.url)" class="tile" [routerLink]="b.url || '/products'" [attr.aria-label]="b.title">
            <img [src]="b.image" [alt]="b.title" loading="lazy" decoding="async" />
            <div class="overlay"></div>
            <div class="copy">
              <div class="title">{{ b.title }}</div>
              <div class="subtitle" *ngIf="b.subtitle" appSmartTextOnImage sampleRegion="bottom-left">{{ b.subtitle }}</div>
              <span class="cta bg-primary">Cotizar</span>
            </div>
          </a>
          <a *ngIf="isExternal(b.url)" class="tile" [href]="b.url!" rel="noopener" target="_blank" [attr.aria-label]="b.title">
            <img [src]="b.image" [alt]="b.title" loading="lazy" decoding="async" />
            <div class="overlay"></div>
            <div class="copy">
              <div class="title">{{ b.title }}</div>
              <div class="subtitle" *ngIf="b.subtitle" appSmartTextOnImage sampleRegion="bottom-left">{{ b.subtitle }}</div>
              <span class="cta bg-primary">Cotizar</span>
            </div>
          </a>
        </ng-container>
      </div>
    </section>
  `,
  styles: [`
  .banners-grid{ display:grid; grid-template-columns: repeat(2, 1fr); gap:12px; }
  .tile{ position:relative; display:block; border-radius:10px; overflow:hidden; background: transparent; border:1px solid rgba(255,255,255,.06); aspect-ratio: 16 / 9; box-shadow: 0 1px 2px rgba(0,0,0,.24); text-decoration:none; }
  img{ position:absolute; inset:0; width:100%; height:100%; object-fit:cover; display:block; }
    .overlay{ position:absolute; inset:0; background:
      linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(0,0,0,.25) 100%);
      pointer-events:none; transition: opacity .2s ease-in; opacity:.9; }
    .tile:hover .overlay{ opacity:1; }
  .copy{ position:absolute; left:12px; bottom:12px; right:12px; color:#fff; display:flex; flex-direction:column; gap:6px; }
  .title{ font-weight:700; color: var(--brand-primary); font-size: clamp(18px, 2.4vw, 24px); line-height:1.1; }
  .subtitle{ color: rgba(255,255,255,.65); font-size: clamp(13px, 1.6vw, 16px); }
  .subtitle.dark-text{ color:#000; }
  .cta{ align-self:flex-start; margin-top:2px; text-decoration:none; padding:6px 10px; border-radius:6px; font-size:14px; display:inline-block; color:#000; background: var(--brand-primary); border:1px solid var(--brand-primary); }
  /* If odd number of tiles, make the last one span both columns to avoid right-side gap */
  @media (min-width: 600px){ .banners-grid .tile:nth-last-child(1):nth-child(odd){ grid-column: 1 / -1; } }
  @media (max-width: 959px){ .banners-grid{ grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 599px){ .banners-grid{ grid-template-columns: 1fr; } }
  `]
})
export class BannersComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  protected banners = signal<Banner[]>([]);
  isExternal(url?: string){ return !!url && /^(https?:)?\/\//i.test(url); }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.http.get<Banner[]>(`/assets/data/banners.json`).subscribe({
        next: (res) => this.banners.set(res ?? []),
        error: () => this.banners.set([])
      });
    }
  }
}
