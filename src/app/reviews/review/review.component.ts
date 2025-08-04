import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate, stagger, query } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { ApplicationServiceService } from '../../services/application-service.service';
import { AlertService } from '../../services/alert.service';
import { RouterLink } from '@angular/router';


interface Review {
  id: number;
  name: string;
  course: string;
  rating: number;
  comment: string;
  date: Date;
  avatar?: string;
}

@Component({
  selector: 'app-review',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './review.component.html',
  styleUrl: './review.component.scss',
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
export class ReviewComponent {

  constructor(private service: ApplicationServiceService, private alert: AlertService) { }

  reviews: any = [];

  newReview = {
    name: '',
    course: '',
    rating: 0,
    comment: ''
  };

  courses = [
    'Advanced Mathematics',
    'Physics Mastery',
    'Chemistry Excellence',
    'Biology Intensive',
    'English Literature',
    'Computer Science'
  ];

  averageRating = 0;
  totalReviews = 0;
  showReviewForm = false;
  hoveredStar = 0;

  ngOnInit() {
    this.getAllReviews();
    
  }

  getAllReviews() {
    this.service.getAllReviews((res: any) => {
      if (res.status === 200) {
        this.reviews = res.data;
        this.calculateAverageRating(); 
      }
    });
  }
  

  calculateAverageRating() {
    this.totalReviews = this.reviews.length;
    if (this.totalReviews > 0) {
      const sum = this.reviews.reduce((acc: any, review: any) => acc + review.rating, 0);
      this.averageRating = Math.round((sum / this.totalReviews) * 10) / 10;
    }
  }

  setRating(rating: number) {
    this.newReview.rating = rating;
  }

  setHoveredStar(star: number) {
    this.hoveredStar = star;
  }

  clearHoveredStar() {
    this.hoveredStar = 0;
  }

  getStarClass(star: number, rating: number): string {
    if (this.hoveredStar > 0) {      return star <= this.hoveredStar ? 'text-yellow-400' : 'text-gray-300';

    }
    return star <= rating ? 'text-yellow-400' : 'text-gray-300';
  }

  submitReview() {
    if (this.newReview.name && this.newReview.course && this.newReview.rating && this.newReview.comment) {
      const review: any = {
        id: this.reviews.length + 1,
        name: this.newReview.name,
        course: this.newReview.course,
        rating: this.newReview.rating,
        comment: this.newReview.comment,
        date: new Date(),
      };

      this.service.createReview(review, (res: any) => {
        if (res.status == 200) {
          this.alert.success(res.message);
          this.reviews.unshift(review);
          this.calculateAverageRating();
          this.resetForm();
          this.showReviewForm = false;
        }else{
          this.alert.error(res.massage)
        }

      })
      console.log(review);


   
    }
  }

  resetForm() {
    this.newReview = {
      name: '',
      course: '',
      rating: 0,
      comment: ''
    };
    this.hoveredStar = 0;
  }

  toggleReviewForm() {
    this.showReviewForm = !this.showReviewForm;
    if (!this.showReviewForm) {
      this.resetForm();
    }
  }

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
  

}
