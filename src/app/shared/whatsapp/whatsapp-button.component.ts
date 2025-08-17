import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../environments/environment';

// Contrato del componente
// - Input: phoneE164 (string sin '+', ej: 573102687774)
// - Input: message (string opcional)
// - Output: none (abre nueva pestaña hacia wa.me)
// - Comportamiento: botón flotante accesible y responsive, usando colores de marca

@Component({
  selector: 'app-whatsapp-button',
  standalone: true,
  template: `
    <a
      class="whatsapp-fab"
      [href]="waUrl"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chatear por WhatsApp"
      [attr.aria-disabled]="!waUrl ? true : null"
      [attr.tabindex]="!waUrl ? -1 : 0"
      [hidden]="!waUrl"
    >
      <span class="sr-only">WhatsApp</span>
      <!-- Icono SVG ligero para evitar dependencias -->
      <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false">
        <path fill="currentColor" d="M20.52 3.48A11.94 11.94 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.1.55 4.1 1.6 5.88L0 24l6.3-1.64A12 12 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.2-1.25-6.21-3.48-8.52ZM12 22.03c-1.86 0-3.68-.5-5.27-1.44l-.38-.22-3.73.97.99-3.63-.25-.39A9.98 9.98 0 1 1 22 12c0 5.52-4.48 10.03-10 10.03Zm5.54-7.48c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.68.15-.2.3-.78.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.23-.45-2.34-1.43-.86-.77-1.44-1.72-1.6-2.02-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.68-1.62-.93-2.22-.24-.58-.49-.5-.68-.5h-.58c-.2 0-.52.08-.8.37-.27.3-1.05 1.02-1.05 2.47 0 1.45 1.08 2.85 1.23 3.05.15.2 2.13 3.25 5.15 4.55.72.31 1.28.5 1.72.64.72.23 1.37.2 1.88.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z"/>
      </svg>
    </a>
  `,
  styles: [`
    .whatsapp-fab {
      position: fixed;
      right: clamp(12px, 2vw, 20px);
      bottom: clamp(12px, 2vw, 20px);
      z-index: 1000;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: clamp(44px, 6.5vw, 56px);
      height: clamp(44px, 6.5vw, 56px);
      border-radius: 999px;
      background: var(--brand-primary);
      color: var(--brand-white);
      box-shadow: 0 4px 12px rgba(0,0,0,.25);
      transition: transform .15s ease, box-shadow .15s ease, background .2s ease;
    }
    .whatsapp-fab:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,.3); }
    .whatsapp-fab:active { transform: translateY(0); }
    .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); border: 0; }
    @media (prefers-reduced-motion: reduce) {
      .whatsapp-fab { transition: none; }
    }
  `]
})
export class WhatsappButtonComponent implements OnInit {
  /** Número en formato E.164 sin '+', por ejemplo 573102687774 */
  @Input() phoneE164?: string;
  /** Mensaje opcional; si incluye la URL actual, se adjunta solo en navegador */
  @Input() message?: string;

  waUrl = '';

  constructor(@Inject(PLATFORM_ID) private readonly platformId: Object) {}

  ngOnInit(): void {
  const cfg = (environment as any)?.whatsapp ?? {};

    const phone = (this.phoneE164 ?? cfg.phoneE164 ?? '').toString().trim();
    if (!phone) {
      this.waUrl = '';
      return;
    }

    let msg = this.message ?? cfg.message ?? '';
    const includeUrl = cfg.includePageUrl === true;
    if (includeUrl && isPlatformBrowser(this.platformId)) {
      const current = typeof window !== 'undefined' ? window.location.href : '';
      if (current) {
        msg = msg ? `${msg} ${current}` : current;
      }
    }

    const query = msg ? `?text=${encodeURIComponent(msg)}` : '';
    this.waUrl = `https://wa.me/${phone}${query}`;
  }
}
