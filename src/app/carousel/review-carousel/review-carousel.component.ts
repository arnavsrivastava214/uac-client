import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { ApplicationServiceService } from '../../services/application-service.service';
import { AlertService } from '../../services/alert.service';

// Strongly typed interfaces
export interface Testimonial {
  id: number;
  name: string;
  position: string;   // maps to course
  content: string;     // maps to comment
  rating: number;
  avatar?: string;     // optional – we generate initials
}

export interface ApiResponse {
  status: number;
  data?: any[];
  message?: string;
}

@Component({
  selector: 'app-review-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './review-carousel.component.html',
  styleUrls: ['./review-carousel.component.scss'],
  animations: [
    trigger('slideAnimation', [
      transition(':increment', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('500ms ease-out', style({ transform: 'translateX(0%)', opacity: 1 }))
      ]),
      transition(':decrement', [
        style({ transform: 'translateX(-100%)', opacity: 0 }),
        animate('500ms ease-out', style({ transform: 'translateX(0%)', opacity: 1 }))
      ]),
      transition('* => *', [
        style({ opacity: 0 }),
        animate('500ms ease-in-out', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class ReviewCarouselComponent implements OnInit, OnDestroy {
  // Data
  testimonials: Testimonial[] = [];
  currentIndex = 0;

  // UI states
  loading = false;
  error = false;
  autoSlideInterval: any;
  autoSlideDelay = 5000; // 5 seconds

  // Pause on hover
  hovered = false;

  constructor(
    private service: ApplicationServiceService,
    private alert: AlertService
  ) {}

  ngOnInit(): void {
    this.fetchTestimonials();
  }

  ngOnDestroy(): void {
    this.stopAutoSlide();
  }

  // -------------------- Data fetching --------------------
  fetchTestimonials(): void {
    this.loading = true;
    this.error = false;

    this.service.getAllReviews((res: ApiResponse) => {
      this.loading = false;
      if (res?.status === 200 && Array.isArray(res.data)) {
        this.testimonials = res.data.map((review: any, index) => ({
          id: review.id || index,
          name: review.name,
          position: review.course,          // map course to position
          content: review.comment,           // map comment to content
          rating: review.rating,
          avatar: this.getInitialsAvatar(review.name) // generate avatar
        }));

        if (this.testimonials.length > 0) {
          this.startAutoSlide();
        }
      } else {
        this.error = true;
        this.alert.error('Failed to load testimonials. Please try again.');
      }
    });
  }

  // Generate a simple initials‑based avatar (colored circle with initials)
  private getInitialsAvatar(name: string): string {
    const initials = name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2); // max 2 letters

    // Use a simple data URI with SVG – no external image needed
    const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6', '#f59e0b', '#ef4444'];
    const colorIndex = (name.length + (this.testimonials.length || 0)) % colors.length;
    const bgColor = colors[colorIndex];

    return `data:image/svg+xml,%3Csvg xmlns='https://png.pngtree.com/png-vector/20190223/ourmid/pngtree-student-glyph-black-icon-png-image_691145.jpg' width='40' height='40' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='${bgColor}'/%3E%3Ctext x='20' y='25' font-size='16' text-anchor='middle' fill='white' font-family='Arial, sans-serif' font-weight='bold'%3E${initials}%3C/text%3E%3C/svg%3E`;
  }

  // -------------------- Carousel navigation --------------------
  next(): void {
    if (this.testimonials.length === 0) return;
    this.currentIndex = (this.currentIndex + 1) % this.testimonials.length;
  }

  prev(): void {
    if (this.testimonials.length === 0) return;
    this.currentIndex = (this.currentIndex - 1 + this.testimonials.length) % this.testimonials.length;
  }

  goTo(index: number): void {
    if (index >= 0 && index < this.testimonials.length && index !== this.currentIndex) {
      this.currentIndex = index;
      // Reset auto‑slide timer on manual navigation
      this.stopAutoSlide();
      this.startAutoSlide();
    }
  }

  // -------------------- Auto‑slide with pause on hover --------------------
  startAutoSlide(): void {
    if (this.autoSlideInterval) this.stopAutoSlide();
    if (!this.hovered && this.testimonials.length > 1) {
      this.autoSlideInterval = setInterval(() => this.next(), this.autoSlideDelay);
    }
  }

  stopAutoSlide(): void {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
      this.autoSlideInterval = null;
    }
  }

  @HostListener('mouseenter')
  onMouseEnter(): void {
    this.hovered = true;
    this.stopAutoSlide();
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.hovered = false;
    this.startAutoSlide();
  }

  // -------------------- Keyboard navigation for dots --------------------
  onDotKeydown(event: KeyboardEvent, index: number): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.goTo(index);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.next();
      this.focusDotAfterNavigation();
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.prev();
      this.focusDotAfterNavigation();
    }
  }

  private focusDotAfterNavigation(): void {
    // Allow the DOM to update, then focus the new active dot
    setTimeout(() => {
      const activeDot = document.querySelector('.dot.active') as HTMLElement;
      activeDot?.focus();
    }, 50);
  }

  // -------------------- Helper for star rating --------------------
  getStarArray(rating: number): number[] {
    const fullStars = Math.floor(Math.max(0, Math.min(5, rating)));
    return Array(fullStars).fill(0);
  }

  // Helper for empty stars (to show gray ones)
  getEmptyStarArray(rating: number): number[] {
    const fullStars = Math.floor(Math.max(0, Math.min(5, rating)));
    const emptyStars = 5 - fullStars;
    return Array(emptyStars).fill(0);
  }
}