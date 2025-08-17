import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserListsService } from '../../shared/data/user-lists.service';

@Component({
  selector: 'app-compare',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="theme-container" style="padding:16px 0;">
      <h2 class="primary-text" style="margin:0 0 12px;">Comparar</h2>
      <div *ngIf="lists.compare().length; else empty">
        <div class="grid">
          <div class="card" *ngFor="let p of lists.compare()">
            <a [routerLink]="['/products', p.id]" class="media"><img [src]="p.images[0].small" [alt]="p.name" /></a>
            <div class="meta">
              <a [routerLink]="['/products', p.id]" class="title">{{ p.name }}</a>
              <div class="row between">
                <div class="price primary-text">{{ p.newPrice | currency:'USD' }}</div>
                <button class="outline" (click)="lists.removeFromCompare(p.id)">Quitar</button>
              </div>
            </div>
          </div>
        </div>
        <div class="row end" style="margin-top:12px;">
          <button class="outline" (click)="lists.clearCompare()">Limpiar comparar</button>
        </div>
      </div>
      <ng-template #empty>
        <div class="text-muted">No tienes productos para comparar.</div>
      </ng-template>
    </section>
  `,
  styles: [`
    .grid{ display:grid; gap:16px; grid-template-columns: 1fr; }
    @media (min-width: 600px){ .grid{ grid-template-columns: repeat(2, 1fr); } }
    @media (min-width: 1280px){ .grid{ grid-template-columns: repeat(3, 1fr); } }
  .card{ padding:12px; background: var(--neutral-background); border:1px solid rgba(255,255,255,.08); border-radius:6px; display:flex; flex-direction:column; height:100%; }
    .media{ width:100%; height:180px; display:block; }
  .media img{ width:100%; height:100%; object-fit:contain; background: var(--neutral-background); display:block; }
  .meta{ display:flex; flex-direction:column; gap:8px; margin-top:8px; }
  .meta .desc, .meta .category{ color: rgba(255,255,255,.65); }
  .title{ font-weight:600; color: var(--brand-primary); min-height:40px; line-height:1.2; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; text-decoration:none; }
    .row{ display:flex; gap:8px; }
    .row.between{ justify-content:space-between; align-items:center; }
    .row.end{ justify-content:flex-end; }
  .outline{ background: var(--brand-primary); color:#000; border:none; border-radius:6px; padding:6px 10px; cursor:pointer; font-weight:600; transition: filter .15s ease-in-out; }
  .outline:hover{ filter: brightness(.95); }
  .outline:active,
  .outline[aria-pressed="true"]{ background: color-mix(in srgb, var(--neutral-background), #fff 35%); color:#fff; }
  .outline:focus-visible{ outline:2px solid #000; outline-offset:2px; }
  `]
})
export class ComparePage{
  readonly lists = inject(UserListsService);
}
