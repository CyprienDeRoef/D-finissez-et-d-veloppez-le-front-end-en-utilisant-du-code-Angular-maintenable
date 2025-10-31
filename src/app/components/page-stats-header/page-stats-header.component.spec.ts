import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageStatsHeaderComponent } from './page-stats-header.component';

describe('PageStatsHeaderComponent', () => {
  let component: PageStatsHeaderComponent;
  let fixture: ComponentFixture<PageStatsHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageStatsHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageStatsHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
