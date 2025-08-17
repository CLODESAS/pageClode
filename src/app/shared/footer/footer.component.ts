import { Component, OnInit, signal } from '@angular/core';
import { GoogleMap, MapMarker } from '@angular/google-maps';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';
import { GoogleMapsLoaderService } from '../maps-loader.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, GoogleMap, MapMarker],
  template: `
    <footer class="app-footer">
      <div class="footer-content">
        <h3>Ubicación</h3>
        <div *ngIf="ready(); else noMap">
          <google-map [height]="300" [width]="'100%'" [center]="center" [zoom]="15">
            <map-marker [position]="center"></map-marker>
          </google-map>
        </div>
        <ng-template #noMap>
          <p style="color:#666">Mapa no disponible (API key no configurada).</p>
        </ng-template>
        <div class="social at-bottom">
          <span class="label">Síguenos</span>
          <nav aria-label="Redes sociales" class="icons">
            <a class="icon" href="https://www.facebook.com/" target="_blank" rel="noopener" aria-label="Facebook" title="Facebook">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 12a10 10 0 1 0-11.6 9.9v-7h-2v-3h2v-2.3c0-2 1.2-3.1 3-3.1.9 0 1.8.1 1.8.1v2h-1c-1 0-1.3.6-1.3 1.2V12h2.3l-.4 3h-1.9v7A10 10 0 0 0 22 12"/></svg>
            </a>
            <a class="icon" href="https://www.instagram.com/" target="_blank" rel="noopener" aria-label="Instagram" title="Instagram">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.5A5.5 5.5 0 1 1 6.5 13 5.5 5.5 0 0 1 12 7.5zm0 2A3.5 3.5 0 1 0 15.5 13 3.5 3.5 0 0 0 12 9.5zm5.75-3.25a1 1 0 1 1-1 1 1 1 0 0 1 1-1z"/></svg>
            </a>
            <a class="icon" href="https://www.linkedin.com/" target="_blank" rel="noopener" aria-label="LinkedIn" title="LinkedIn">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.94 6.5A1.94 1.94 0 1 1 5 4.56 1.94 1.94 0 0 1 6.94 6.5ZM4.75 8.5h4.38v10.75H4.75Zm6.13 0h4.2v1.47h.06a4.6 4.6 0 0 1 4.14-2.27c4.43 0 5.25 2.91 5.25 6.69v4.86h-4.38v-4.31c0-1.03 0-2.36-1.44-2.36s-1.67 1.13-1.67 2.29v4.38h-4.38Z"/></svg>
            </a>
            <a class="icon" href="https://x.com/" target="_blank" rel="noopener" aria-label="X (Twitter)" title="X (Twitter)">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3h6l4.5 6.1L18.9 3H21l-6.9 9.2L21 21h-6l-4.9-6.6L8.5 21H3l7.2-9.8Z"/></svg>
            </a>
          </nav>
        </div>
      </div>
    </footer>
  `,
  styles: [`
  .app-footer { padding: 16px; background: var(--neutral-background); border-top: 1px solid rgba(255,255,255,.08); color: rgba(255,255,255,.85); }
  .footer-content { max-width: 1200px; margin: 0 auto; display:flex; flex-direction:column; gap:16px; position:relative; }
  .social{ display:flex; align-items:center; gap:12px; }
  .social .label{ font-weight:600; color: var(--brand-primary); }
  .icons{ display:flex; gap:12px; }
  .icon{ display:inline-flex; width:36px; height:36px; align-items:center; justify-content:center; border-radius:8px; background: var(--brand-primary); color: var(--on-primary, #000); text-decoration:none; transition: filter .15s ease-in-out; }
  .icon:hover{ filter: brightness(.95); }
  .icon:active{ background: var(--neutral-pressed, #5a5a5a); background: color-mix(in srgb, var(--neutral-background), #fff 35%); color:#fff; }
  .icon svg{ width:20px; height:20px; fill: currentColor; }
  .social.at-bottom{ align-self:flex-end; }
  @media (max-width: 768px){ .social.at-bottom{ align-self:stretch; justify-content:flex-end; } }
  `]
})
export class FooterComponent implements OnInit {
  private readonly apiKey = environment.googleMapsApiKey;
  readonly ready = signal(false);
  center = { lat: -12.0464, lng: -77.0428 } as google.maps.LatLngLiteral; // Lima por defecto

  constructor(private readonly mapsLoader: GoogleMapsLoaderService) {}

  ngOnInit(): void {
    if (!this.apiKey) {
      // Sin key: no intentamos cargar
      this.ready.set(false);
      return;
    }
    this.mapsLoader
      .load(this.apiKey)
      .then(() => this.ready.set(true))
      .catch(() => this.ready.set(false));
  }
}
