import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BrandsService, Brand } from '../../shared/data/brands.service';

@Component({
  selector: 'app-brands',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
  <section class="theme-container" style="padding:16px 0;">
    <h2 class="primary-text" style="margin:0 0 12px 0;">Marcas</h2>
    <form (submit)="$event.preventDefault()" class="filters">
      <label>Buscar
        <input type="text" [(ngModel)]="query" (ngModelChange)="apply()" name="q" placeholder="Buscar marcas..." />
      </label>
      <div class="letters">
        <button type="button" class="letter" [class.selected]="letter==='all'" (click)="setLetter('all')">Todas</button>
        <button *ngFor="let l of letters" type="button" class="letter" [class.selected]="letter===l" (click)="setLetter(l)">{{l}}</button>
      </div>
    </form>
    <div class="brands-grid">
      <a class="brand mat-elevation-z3 light-block" *ngFor="let b of filtered()" [routerLink]="['/brands', b.name]">
        <img [src]="b.image" [alt]="b.name" />
        <span class="name">{{ b.name }}</span>
      </a>
    </div>
  </section>
  `,
  styles: [`
    .filters{ display:flex; gap:12px; align-items:end; margin:0 0 12px 0; flex-wrap:wrap; }
    .letters{ display:flex; gap:6px; flex-wrap:wrap; }
    .letters .letter{ border:1px solid rgba(255,255,255,.2); background: var(--neutral-background); color:inherit; border-radius:4px; padding:4px 8px; cursor:pointer; }
    .letters .letter.selected{ box-shadow: 0 0 0 2px var(--brand-primary); }
    .brands-grid{ display:grid; gap:14px; grid-template-columns: repeat(2, minmax(0,1fr)); }
    @media (min-width: 900px){ .brands-grid{ grid-template-columns: repeat(4, minmax(0,1fr)); } }
    .brand{ display:flex; flex-direction:column; align-items:center; justify-content:center; padding:12px; border:1px solid rgba(255,255,255,.08); border-radius:8px; text-decoration:none; color:inherit; background: var(--neutral-background); }
    .brand img{ width: 180px; height: 80px; object-fit:contain; display:block; }
    .brand .name{ margin-top:6px; color: rgba(255,255,255,.65); text-transform:capitalize; }
  `]
})
export class BrandsPage implements OnInit {
  protected all = signal<Brand[]>([]);
  protected filtered = signal<Brand[]>([]);
  protected query = '';
  protected letter: string = 'all';
  protected letters = Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ');

  constructor(private readonly svc: BrandsService){}

  ngOnInit(): void {
    const list = this.svc.getBrands();
    this.all.set(list);
    this.apply();
  }

  setLetter(l: string){ this.letter = l; this.apply(); }

  apply(){
    const q = this.query.toLowerCase().trim();
    const l = this.letter;
    let list = this.all();
    if (q) list = list.filter(b => b.name.toLowerCase().includes(q));
    if (l !== 'all') list = list.filter(b => b.name[0].toLowerCase() === l.toLowerCase());
    this.filtered.set(list);
  }
}
