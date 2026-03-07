import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { trigger, transition, style, animate, stagger, query } from '@angular/animations';

import { ApplicationServiceService } from '../../services/application-service.service';
import { AlertService } from '../../services/alert.service';

// Strongly typed interfaces
export interface Review {
  id: number;
  name: string;
  course: string;
  rating: number;
  comment: string;
  date: string;          // ISO string from backend
  avatar?: string;
}

export interface NewReview {
  name: string;
  course: string;
  rating: number;
  comment: string;
}

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss'],
  animations: [
    trigger('slideInUp', [
      transition(':enter', [
        style({ transform: 'translateY(100px)', opacity: 0 }),
        animate('600ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ]),
    trigger('staggerAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(50px)' }),
          stagger(200, [
            animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('starAnimation', [
      transition(':enter', [
        style({ transform: 'scale(0) rotate(180deg)', opacity: 0 }),
        animate('400ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
          style({ transform: 'scale(1) rotate(0deg)', opacity: 1 }))
      ])
    ])
  ]
})
export class ReviewComponent implements OnInit, OnDestroy {
  // Data
  reviews: Review[] = [];
  filteredReviews: Review[] = [];
  courses: string[] = [
    'Advanced Mathematics',
    'Physics Mastery',
    'Chemistry Excellence',
    'Biology Intensive',
    'English Literature',
  ];

  // UI State
  loadingReviews = false;
  submittingReview = false;
  errorFetching = false;
  showReviewForm = false;
  selectedCourse = '';
  hoveredStar = 0;

  // For "Read more" functionality
  showFull: { [key: number]: boolean } = {};

  // Average rating summary
  averageRating = 0;
  totalReviews = 0;

  // Reactive form
  reviewForm: FormGroup;

  constructor(
    private service: ApplicationServiceService,
    private alert: AlertService,
    private fb: FormBuilder
  ) {
    this.reviewForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      course: ['', Validators.required],
      rating: [0, [Validators.required, Validators.min(1)]],
      comment: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    this.getAllReviews();
  }

  ngOnDestroy(): void {
    // If you ever switch to Observables, add unsubscribe logic here.
  }

  // -------------------- Data Fetching --------------------
  getAllReviews(): void {
    this.loadingReviews = true;
    this.errorFetching = false;
    this.service.getAllReviews((res: any) => {
      this.loadingReviews = false;
      if (res?.status === 200) {
        this.reviews = res.data || [];
        this.applyFilter();
        this.calculateAverageRating();
      } else {
        this.errorFetching = true;
        this.alert.error('Failed to load reviews. Please refresh the page.');
      }
    });
  }

  // -------------------- Filtering --------------------
  filterByCourse(): void {
    this.applyFilter();
  }

  private applyFilter(): void {
    if (!this.selectedCourse) {
      this.filteredReviews = [...this.reviews];
    } else {
      this.filteredReviews = this.reviews.filter(r => r.course === this.selectedCourse);
    }
  }

  // -------------------- Rating Summary --------------------
  calculateAverageRating(): void {
    this.totalReviews = this.reviews.length;
    if (this.totalReviews === 0) {
      this.averageRating = 0;
      return;
    }
    const sum = this.reviews.reduce((acc, r) => acc + r.rating, 0);
    this.averageRating = Math.round((sum / this.totalReviews) * 10) / 10;
  }

  // -------------------- Star Rating Helpers --------------------
  setRating(rating: number): void {
    this.reviewForm.patchValue({ rating });
    // Mark as touched to trigger validation display
    this.reviewForm.get('rating')?.markAsTouched();
  }

  setHoveredStar(star: number): void {
    this.hoveredStar = star;
  }

  clearHoveredStar(): void {
    this.hoveredStar = 0;
  }

  getStarClass(star: number): string {
    const rating = this.reviewForm.get('rating')?.value || 0;
    if (this.hoveredStar > 0) {
      return star <= this.hoveredStar ? 'text-yellow-400' : 'text-gray-300';
    }
    return star <= rating ? 'text-yellow-400' : 'text-gray-300';
  }

  // Keyboard accessibility for stars
  incrementRating(): void {
    const current = this.reviewForm.get('rating')?.value || 0;
    if (current < 5) {
      this.setRating(current + 1);
    }
  }

  decrementRating(): void {
    const current = this.reviewForm.get('rating')?.value || 0;
    if (current > 1) {
      this.setRating(current - 1);
    }
  }

  // -------------------- Form Submission --------------------
  submitReview(): void {
    if (this.reviewForm.invalid) {
      this.reviewForm.markAllAsTouched();
      this.alert.warning('Please fill all fields correctly.');
      return;
    }

    this.submittingReview = true;
    const newReview: NewReview = this.reviewForm.value;

    this.service.createReview(newReview, (res: any) => {
      this.submittingReview = false;
      if (res?.status === 200) {
        this.alert.success(res.message || 'Review submitted successfully!');

        // Optimistically add the new review to the list
        const createdReview: Review = {
          id: Date.now(), // temporary; backend should return real id
          ...newReview,
          date: new Date().toISOString()
        };
        this.reviews.unshift(createdReview);
        this.applyFilter();
        this.calculateAverageRating();

        // Reset form and close
        this.resetForm();
        this.showReviewForm = false;
      } else {
        this.alert.error(res?.message || 'Failed to submit review. Please try again.');
      }
    });
  }

  resetForm(): void {
    this.reviewForm.reset({ name: '', course: '', rating: 0, comment: '' });
    this.hoveredStar = 0;
  }

  toggleReviewForm(): void {
    this.showReviewForm = !this.showReviewForm;
    if (!this.showReviewForm) {
      this.resetForm();
    }
  }

  // -------------------- Utility --------------------
  getTimeAgo(dateInput: string | Date): string {
    const date = new Date(dateInput);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (seconds < 60) return 'just now';
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (days < 30) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (days < 365) return `${months} month${months > 1 ? 's' : ''} ago`;
    return `${years} year${years > 1 ? 's' : ''} ago`;
  }

  // "Read more" toggle
  toggleReadMore(id: number): void {
    this.showFull[id] = !this.showFull[id];
  }
}