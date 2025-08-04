import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreeNotesComponent } from './free-notes.component';

describe('FreeNotesComponent', () => {
  let component: FreeNotesComponent;
  let fixture: ComponentFixture<FreeNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FreeNotesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FreeNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
