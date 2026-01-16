import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TitleCasePipe } from '@angular/common';

import {
  TestDataService,
  Question,
  TestAttempt,
} from '../../services/test-data.service';

interface UserAnswer {
  questionId: number;
  selectedOption: 'A' | 'B' | 'C' | 'D' | null;
  isMarked: boolean;
}

@Component({
  selector: 'app-test-screen',
  standalone: true,
  templateUrl: './test-screen.component.html',
  styleUrls: ['./test-screen.component.scss'],
  imports: [CommonModule, TitleCasePipe, RouterModule],
})
export class TestScreenComponent implements OnInit, OnDestroy {
  testId!: number;
  attemptId!: number;

  questions: Question[] = [];
  currentQuestionIndex = 0;

  userAnswers: UserAnswer[] = [];

  timeRemaining = 600; // default
  timerInterval: any;

  loading = false;
  submitting = false;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private testDataService: TestDataService
  ) {}

  ngOnInit(): void {
    this.testId = Number(this.route.snapshot.paramMap.get('testId'));

    if (!this.testId) {
      alert('Invalid test id');
      this.router.navigate(['/tests']);
      return;
    }

    this.startAttemptAndLoadQuestions();
  }

  ngOnDestroy(): void {
    if (this.timerInterval) clearInterval(this.timerInterval);
  }

  // ✅ Start attempt -> get attemptId -> fetch locked questions
  startAttemptAndLoadQuestions(): void {
    this.loading = true;

    this.testDataService
      .startTestAttempt(this.testId, { name: 'Student', phone: null })
      .subscribe({
        next: (res) => {
          this.attemptId = res.attemptId;

                  this.timeRemaining = res.test.duration_minutes * 60;

          this.testDataService.setSelectedTest(res.test);

          this.loadAttemptQuestions();
        },
        error: (err) => {
          console.error(err);
          alert('Failed to start test attempt');
          this.loading = false;
        },
      });
  }

  // ✅ fetch questions for this attempt
  loadAttemptQuestions(): void {
    this.testDataService.getQuestionsForAttempt(this.attemptId).subscribe({
      next: (questions) => {
        this.questions = questions;

        this.userAnswers = this.questions.map((q) => ({
          questionId: q.id,
          selectedOption: null,
          isMarked: false,
        }));

        this.loading = false;
        this.startTimer();
      },
      error: (err) => {
        console.error(err);
        alert('Failed to load questions');
        this.loading = false;
      },
    });
  }

  // ✅ timer
  startTimer(): void {
    if (this.timerInterval) clearInterval(this.timerInterval);

    this.timerInterval = setInterval(() => {
      this.timeRemaining--;

      if (this.timeRemaining === 60) {
        this.showTimeWarning();
      }

      if (this.timeRemaining <= 0) {
        clearInterval(this.timerInterval);
        this.autoSubmit();
      }
    }, 1000);
  }

  showTimeWarning(): void {
    console.log('⚠️ Only 1 minute remaining!');
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  }

  asOption(option: string): 'A' | 'B' | 'C' | 'D' {
    return option as 'A' | 'B' | 'C' | 'D';
  }
  

  // options text
  getOptionText(option: 'A' | 'B' | 'C' | 'D'): string {
    const question = this.questions[this.currentQuestionIndex];
    if (!question) return '';

    switch (option) {
      case 'A':
        return question.option_a;
      case 'B':
        return question.option_b;
      case 'C':
        return question.option_c;
      case 'D':
        return question.option_d;
      default:
        return '';
    }
  }
  options: ('A' | 'B' | 'C' | 'D')[] = ['A', 'B', 'C', 'D'];
  // select option
  selectOption(option: 'A' | 'B' | 'C' | 'D'): void {
    const currentAnswer = this.userAnswers[this.currentQuestionIndex];
    currentAnswer.selectedOption = option;
  }

  // UI class (simple highlight)
  getOptionClass(option: string): string {
    const currentAnswer = this.userAnswers[this.currentQuestionIndex];

    if (currentAnswer.selectedOption === option) {
      return 'bg-blue-50 border-blue-500 text-blue-700';
    }

    return 'border-gray-300 text-gray-700 hover:border-blue-400';
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
    }
  }

  previousQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  goToQuestion(index: number): void {
    this.currentQuestionIndex = index;
  }

  markForReview(): void {
    this.userAnswers[this.currentQuestionIndex].isMarked =
      !this.userAnswers[this.currentQuestionIndex].isMarked;
  }

  getQuestionButtonClass(index: number): string {
    const answer = this.userAnswers[index];

    if (answer.isMarked) {
      return 'bg-yellow-500 text-white font-bold';
    }

    if (answer.selectedOption) {
      return 'bg-blue-500 text-white';
    }

    return 'bg-gray-200 text-gray-700 hover:bg-gray-300';
  }

  getAnsweredCount(): number {
    return this.userAnswers.filter((a) => a.selectedOption !== null).length;
  }

  // ✅ Submit to backend (backend calculates score)
  submitTest(): void {
    if (!this.attemptId) {
      alert('Attempt not started properly');
      return;
    }

    this.submitting = true;
    clearInterval(this.timerInterval);

    const payload = {
      attemptId: this.attemptId,
      timeTakenSeconds: (this.testDataService as any) ? 0 : 0, // optional
      answers: this.userAnswers.map((a) => ({
        questionId: a.questionId,
        selectedOption: a.selectedOption,
      })),
    };

    this.testDataService.submitTestAttempt(payload).subscribe({
      next: (attempt: TestAttempt) => {
        this.testDataService.setCurrentAttempt(attempt);
        this.submitting = false;
        this.router.navigate(['/result', attempt.id]);
      },
      error: (err) => {
        console.error(err);
        alert('Failed to submit test');
        this.submitting = false;
      },
    });
  }

  autoSubmit(): void {
    console.log('⏰ Time up! Auto-submitting test...');
    this.submitTest();
  }
}
