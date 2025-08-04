import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewCarouselComponent } from './review-carousel.component';

describe('ReviewCarouselComponent', () => {
  let component: ReviewCarouselComponent;
  let fixture: ComponentFixture<ReviewCarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewCarouselComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
