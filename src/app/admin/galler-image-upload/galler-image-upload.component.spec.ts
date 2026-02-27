import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GallerImageUploadComponent } from './galler-image-upload.component';

describe('GallerImageUploadComponent', () => {
  let component: GallerImageUploadComponent;
  let fixture: ComponentFixture<GallerImageUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GallerImageUploadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GallerImageUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
