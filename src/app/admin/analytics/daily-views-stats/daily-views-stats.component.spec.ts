import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyViewsStatsComponent } from './daily-views-stats.component';

describe('DailyViewsStatsComponent', () => {
  let component: DailyViewsStatsComponent;
  let fixture: ComponentFixture<DailyViewsStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailyViewsStatsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DailyViewsStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
