import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MontlySalesComponent } from './montly-sales.component';

describe('MontlySalesComponent', () => {
  let component: MontlySalesComponent;
  let fixture: ComponentFixture<MontlySalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MontlySalesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MontlySalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
