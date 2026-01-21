import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultImagesUploadComponent } from './result-images-upload.component';

describe('ResultImagesUploadComponent', () => {
  let component: ResultImagesUploadComponent;
  let fixture: ComponentFixture<ResultImagesUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultImagesUploadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultImagesUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
