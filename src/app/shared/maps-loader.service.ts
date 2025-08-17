import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GoogleMapsLoaderService {
  private loading?: Promise<void>;

  load(apiKey: string): Promise<void> {
    // Ya cargado o en carga
    if ((window as any).google?.maps) {
      return Promise.resolve();
    }
    if (this.loading) {
      return this.loading;
    }
    if (!apiKey) {
      // Sin API key: no hacemos nada
      return Promise.resolve();
    }
    this.loading = new Promise<void>((resolve, reject) => {
      const existing = document.querySelector('script[data-google-maps-loader]') as HTMLScriptElement | null;
      if (existing) {
        existing.addEventListener('load', () => resolve());
        existing.addEventListener('error', () => reject(new Error('Google Maps script failed to load')));
        return;
      }
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.defer = true;
      script.setAttribute('data-google-maps-loader', 'true');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&libraries=places`;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Google Maps script failed to load'));
      document.head.appendChild(script);
    });
    return this.loading;
  }
}
