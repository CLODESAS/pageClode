import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsDialogComponent } from './products-dialog.component';

describe('ProductsDialogComponent', () => {
  let component: ProductsDialogComponent;
  let fixture: ComponentFixture<ProductsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
