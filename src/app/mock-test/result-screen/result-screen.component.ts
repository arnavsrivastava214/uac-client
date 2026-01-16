import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule, NgFor, TitleCasePipe } from '@angular/common';
import { HeaderComponent } from '../../headers/header/header.component';

import { TestDataService, TestAttempt } from '../../services/test-data.service';

interface QuestionReview {
  question: string;
  userAnswer: string;
  userAnswerText: string;
  correctAnswer: string;
  correctAnswerText: string;
  isCorrect: boolean;
  difficulty: string;
  explanation: string | null;
}

@Component({
  selector: 'app-result-screen',
  standalone: true,
  templateUrl: './result-screen.component.html',
  styleUrls: ['./result-screen.component.scss'],
  imports: [CommonModule, HeaderComponent, TitleCasePipe, NgFor, RouterModule],
})
export class ResultScreenComponent implements OnInit {
  attemptId!: number;

  result!: TestAttempt;
  questionReviews: QuestionReview[] = [];

  loading = false;

  constructor(
    private route: ActivatedRoute,
    private testDataService: TestDataService
  ) {}

  ngOnInit(): void {
    this.attemptId = Number(this.route.snapshot.paramMap.get('attemptId'));

    if (!this.attemptId) return;

    this.loadResult();
  }

  loadResult(): void {
    this.loading = true;

    // ✅ 1) get result summary
    this.testDataService.getAttemptResult(this.attemptId).subscribe({
      next: (res) => {
        this.result = res;

        // ✅ 2) get review (question + user answer + correct answer)
        this.loadReview();
      },
      error: (err) => {
        console.error(err);
        alert('Failed to load result');
        this.loading = false;
      },
    });
  }

  loadReview(): void {
    this.testDataService.getAttemptReview(this.attemptId).subscribe({
      next: (rows: any[]) => {
        this.questionReviews = rows.map((r) => {
          const getText = (opt: string) => {
            if (opt === 'A') return r.option_a;
            if (opt === 'B') return r.option_b;
            if (opt === 'C') return r.option_c;
            if (opt === 'D') return r.option_d;
            return '-';
          };

          const userOpt = r.selected_option || '-';
          const correctOpt = r.correct_option;

          return {
            question: r.question,
            userAnswer: userOpt,
            userAnswerText: userOpt === '-' ? 'Not Answered' : getText(userOpt),
            correctAnswer: correctOpt,
            correctAnswerText: getText(correctOpt),
            isCorrect: userOpt !== '-' && userOpt === correctOpt,
            difficulty: r.difficulty,
            explanation: r.explanation || null,
          };
        });

        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        alert('Failed to load question review');
        this.loading = false;
      },
    });
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  }
}
