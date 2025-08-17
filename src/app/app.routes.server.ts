import { RenderMode, type ServerRoute } from '@angular/ssr';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

type ProductLite = { id: number };

export const serverRoutes: ServerRoute[] = [
  {
    path: 'products/:id',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      try {
        const file = join(process.cwd(), 'src', 'assets', 'data', 'products.json');
        const raw = await readFile(file, 'utf-8');
        const list = (JSON.parse(raw) as ProductLite[]).slice(0, 20);
        return list.map((p) => ({ id: String(p.id) }));
      } catch {
        return [];
      }
    },
  },
  // Página de detalle de marca: ruta con parámetro, render en servidor en tiempo real
  {
    path: 'brands/:name',
    renderMode: RenderMode.Server,
  },
  { path: '**', renderMode: RenderMode.Prerender },
];
