import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradientOverlayComponent } from './gradient-overlay.component';

describe('GradientOverlayComponent', () => {
  let component: GradientOverlayComponent;
  let fixture: ComponentFixture<GradientOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GradientOverlayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GradientOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
