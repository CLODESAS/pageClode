import { TestBed } from '@angular/core/testing';
import { ProductsListComponent } from './products-list.component';

// Datos de ejemplo
const makeProduct = (id: number, name: string, price: number, categoryId?: number) => ({
  id,
  name,
  newPrice: price,
  images: [{ small: 's', medium: 'm', big: 'b' }],
  categoryId,
});

describe('ProductsListComponent (filtros)', () => {
  it('filtra por categoría y rango de precios', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(ProductsListComponent);
    const comp = fixture.componentInstance as ProductsListComponent & {
      products: { set(v: any): void };
      filtered: () => any[];
      priceMin: number; priceMax: number;
      selectedCat: number; minPrice: number | null; maxPrice: number | null;
      applyFilters(updateQuery?: boolean): void;
    };

    const list = [
      makeProduct(1, 'A', 100, 1),
      makeProduct(2, 'B', 200, 1),
      makeProduct(3, 'C', 300, 2),
    ];
    comp.products.set(list);
    comp.priceMin = 0; comp.priceMax = 1000;
    comp.selectedCat = 1;
    comp.minPrice = 150;
    comp.maxPrice = 250;

    comp.applyFilters(false);
    const result = comp.filtered();
    expect(result.length).toBe(1);
    expect(result[0].id).toBe(2);
  });

  it('ordena por nombre descendente', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(ProductsListComponent);
    const comp = fixture.componentInstance as ProductsListComponent & {
      products: { set(v: any): void };
      filtered: () => any[];
      sortBy: 'relevance'|'priceAsc'|'priceDesc'|'nameAsc'|'nameDesc';
      applyFilters(updateQuery?: boolean): void;
    };

    const list = [
      makeProduct(1, 'Alpha', 100),
      makeProduct(2, 'Zulu', 200),
      makeProduct(3, 'Mike', 150),
    ];
    comp.products.set(list);
    comp.sortBy = 'nameDesc';
    comp.applyFilters(false);
    const ordered = comp.filtered();
    expect(ordered.map(p => p.name)).toEqual(['Zulu','Mike','Alpha']);
  });
});
