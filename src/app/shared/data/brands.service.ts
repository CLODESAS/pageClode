import { Injectable } from '@angular/core';

export type Brand = { name: string; image: string };

@Injectable({ providedIn: 'root' })
export class BrandsService {
  // Legacy app provided local images; here we generate placeholders to avoid missing assets.
  private makeImg(name: string) {
    const label = encodeURIComponent(name.toUpperCase());
    // dark background, white text; sized for card row
    return `https://via.placeholder.com/200x90/111111/FFFFFF?text=${label}`;
  }

  getBrands(): Brand[] {
    const names = [
      'aloha','dream','congrats','best','original','retro','king','love','the','easter','with','special','bravo'
    ];
    return names.map(n => ({ name: n, image: this.makeImg(n) }));
  }
}
