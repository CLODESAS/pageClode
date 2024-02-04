import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MostViewedProductsComponent } from './most-viewed-products.component';

describe('MostViewedProductsComponent', () => {
  let component: MostViewedProductsComponent;
  let fixture: ComponentFixture<MostViewedProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MostViewedProductsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MostViewedProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
