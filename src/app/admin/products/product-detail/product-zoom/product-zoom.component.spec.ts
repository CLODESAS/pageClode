import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductZoomComponent } from './product-zoom.component';

describe('ProductZoomComponent', () => {
  let component: ProductZoomComponent;
  let fixture: ComponentFixture<ProductZoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductZoomComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductZoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
