import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherCourierComponent } from './teacher-courier.component';

describe('TeacherCourierComponent', () => {
  let component: TeacherCourierComponent;
  let fixture: ComponentFixture<TeacherCourierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherCourierComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherCourierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
