import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../headers/header/header.component';

import { TestDataService, ClassGroup, Subject, Test } from '../../../services/test-data.service';

@Component({
  selector: 'app-test-select',
  standalone: true,
  templateUrl: './test-select.component.html',
  styleUrls: ['./test-select.component.scss'],
  imports: [CommonModule, HeaderComponent, RouterModule],
})
export class TestSelectComponent implements OnInit {
  classGroups: ClassGroup[] = [];
  subjects: Subject[] = [];
  availableTests: Test[] = [];

  selectedClassId: number | null = null;
    selectedSubjectId: number | null = null;

  loadingClasses = false;
  loadingSubjects = false;
  loadingTests = false;

  constructor(
    private testDataService: TestDataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchClasses();
    this.fetchSubjects();
  }

  // ✅ fetch from DB
  fetchClasses(): void {
    this.loadingClasses = true;

    this.testDataService.getClassGroups().subscribe({
      next: (res) => {
        this.classGroups = res;
        this.loadingClasses = false;
      },
      error: (err) => {
        console.error(err);
        this.loadingClasses = false;
        alert('Failed to load classes');
      },
    });
  }

  // ✅ fetch from DB
  fetchSubjects(): void {
    this.loadingSubjects = true;

    this.testDataService.getSubjects().subscribe({
      next: (res) => {
        this.subjects = res;
        this.loadingSubjects = false;
      },
      error: (err) => {
        console.error(err);
        this.loadingSubjects = false;
        alert('Failed to load subjects');
      },
    });
  }

  selectClass(classId: number): void {
    this.selectedClassId = classId;
    this.selectedSubjectId = null;
    this.availableTests = [];
  }
  selectSubject(subjectId: number): void {
    this.selectedSubjectId = subjectId;
    this.updateAvailableTests();   // must be here
  }
  // ✅ tests from DB
  updateAvailableTests(): void {
    if (!this.selectedClassId || !this.selectedSubjectId) {
      this.availableTests = [];
      return;
    }
  
    this.loadingTests = true;
  
    this.testDataService
      .getTestsByFilters(this.selectedClassId, this.selectedSubjectId)
      .subscribe({
        next: (tests) => {
          this.availableTests = tests;
          this.loadingTests = false;
        },
        error: (err) => {
          console.error(err);
          this.availableTests = [];
          this.loadingTests = false;
          alert('Failed to load tests');
        },
      });
  }

  startTest(test: Test): void {
    this.testDataService.setSelectedTest(test);
    this.router.navigate(['/test', test.id]);
  }

  getSubjectEmoji(subjectName: string): string {
    const emojiMap: { [key: string]: string } = {
      Maths: '➗',
      Science: '🔬',
      English: '📚',
      Hindi: '🪷',
      SST: '🌍',
    };
    return emojiMap[subjectName] || '📝';
  }
}
