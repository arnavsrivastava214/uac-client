import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

export interface ClassGroup {
  id: number;
  class_name: string;
  class_group: string;
}

export interface Subject {
  id: number;
  subject_name: string;
}

export interface Test {
  id: number;
  test_title: string;
  class_group: string;
  subject_id: number;
  topic_id: number | null;
  duration_minutes: number;
  total_questions: number;
  difficulty: 'easy' | 'medium' | 'hard';
  is_active: boolean;
}

export interface Question {
  id: number;
  class_group: string;
  subject_id: number;
  topic_id: number | null;
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  // NOTE: correct_option frontend me show nahi karna best hai
  correct_option?: 'A' | 'B' | 'C' | 'D';
  marks: number;
  explanation?: string | null;
}

export interface TestAttempt {
  id: number;
  test_id: number;
  student_name: string | null;
  student_phone: string | null;
  started_at: string;
  submitted_at: string | null;
  total_questions: number;
  correct_count: number;
  wrong_count: number;
  skipped_count: number;
  score: number;
  percentage: number;
  time_taken_seconds: number;
}

export interface StartAttemptResponse {
  attemptId: number;
  test: Test;
}

export interface SubmitPayload {
  attemptId: number;
  timeTakenSeconds: number;
  answers: {
    questionId: number;
    selectedOption: 'A' | 'B' | 'C' | 'D' | null;
  }[];
}

@Injectable({
  providedIn: 'root',
})
export class TestDataService {
  private baseUrl = 'http://localhost:3000/api/uac/test-system';
  // apiUrl: 'https://your-render-backend.onrender.com/api/uac/test-system'

  private selectedTest = new BehaviorSubject<Test | null>(null);
  selectedTest$ = this.selectedTest.asObservable();

  private currentAttempt = new BehaviorSubject<TestAttempt | null>(null);
  currentAttempt$ = this.currentAttempt.asObservable();

  constructor(private http: HttpClient) {}

  // ✅ DB: Get class groups
  getClassGroups(): Observable<ClassGroup[]> {
    return this.http.get<ClassGroup[]>(`${this.baseUrl}/classes`);
  }

  // ✅ DB: Get subjects
  getSubjects(): Observable<Subject[]> {
    return this.http.get<Subject[]>(`${this.baseUrl}/subjects`);
  }

  // ✅ DB: Get tests by filters
  getTestsByFilters(classGroup: string, subjectId: number): Observable<Test[]> {
    let params = new HttpParams()
      .set('class_group', classGroup)
      .set('subject_id', subjectId);

    return this.http.get<Test[]>(`${this.baseUrl}/tests`, { params });
  }

  // ✅ DB: Start attempt (creates attempt + locks random questions)
  startTestAttempt(testId: number, studentInfo?: { name?: string; phone?: any }): Observable<StartAttemptResponse> {
    return this.http.post<StartAttemptResponse>(`${this.baseUrl}/tests/${testId}/start`, {
      student_name: studentInfo?.name || null,
      student_phone: studentInfo?.phone || null,
    });
  }

  // ✅ DB: Get locked questions for attempt
  getQuestionsForAttempt(attemptId: number): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.baseUrl}/attempts/${attemptId}/questions`);
  }

  // ✅ DB: Submit attempt (calculate score server side)
  submitTestAttempt(payload: SubmitPayload): Observable<TestAttempt> {
    return this.http.post<TestAttempt>(`${this.baseUrl}/attempts/${payload.attemptId}/submit`, payload);
  }

  // ✅ DB: Get result anytime
  getAttemptResult(attemptId: number): Observable<TestAttempt> {
    return this.http.get<TestAttempt>(`${this.baseUrl}/attempts/${attemptId}/result`);
  }

  // local state helpers
  setSelectedTest(test: Test): void {
    this.selectedTest.next(test);
  }

  setCurrentAttempt(attempt: TestAttempt): void {
    this.currentAttempt.next(attempt);
  }

  getAttemptReview(attemptId: number) {
    return this.http.get<any[]>(`${this.baseUrl}/attempts/${attemptId}/review`);
  }
  
}
