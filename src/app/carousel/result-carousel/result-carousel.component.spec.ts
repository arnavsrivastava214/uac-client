import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultCarouselComponent } from './result-carousel.component';

describe('ResultCarouselComponent', () => {
  let component: ResultCarouselComponent;
  let fixture: ComponentFixture<ResultCarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultCarouselComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
