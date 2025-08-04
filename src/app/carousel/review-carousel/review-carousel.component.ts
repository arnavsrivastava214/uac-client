import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations'; // Import animation modules
import { FormsModule } from '@angular/forms';
import { ApplicationServiceService } from '../../services/application-service.service';
import { AlertService } from '../../services/alert.service';

interface Testimonial {
  image: string;
  name: string;
  position: string;
  content: string;
  rating: number;
}

@Component({
  selector: 'app-review-carousel',
  imports: [CommonModule, FormsModule],
  templateUrl: './review-carousel.component.html',
  styleUrl: './review-carousel.component.scss',
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
  ]})
export class ReviewCarouselComponent {


  constructor(private service: ApplicationServiceService, private alert: AlertService) { }


  ngOnInit() {
    this.getAllReviews();
    this.startAutoSlide();

    
  }

  testimonials: Testimonial[] = []; 
  currentTestimonialIndex: number = 0;
  private intervalId: any;



  ngOnDestroy(): void {
    this.stopAutoSlide();
  }

  // Helper to generate star icons based on rating
  getStarArray(rating: number): number[] {
    // Ensure rating is a number and within 0-5
    const numRating = Math.max(0, Math.min(5, Math.floor(rating)));
    return Array(numRating).fill(0);
  }

  getAllReviews(): void { // Changed to void as it handles the data internally
    this.service.getAllReviews((res: any) => {
      if (res.status === 200 && res.data && Array.isArray(res.data)) {
        console.log("Fetched reviews:", res.data);

        // Map the incoming data to your Testimonial interface
        this.testimonials = res.data.map((review: any, index: number) => ({
          image: this.generatePlaceholderImage(review.name, index), // Dynamic image based on name/index
          name: review.name,
          position: review.course, // Map 'course' to 'position'
          content: review.comment, // Map 'comment' to 'content'
          rating: review.rating
        }));

        // Start auto-slide ONLY if there are testimonials
        if (this.testimonials.length > 0) {
          this.startAutoSlide();
        } else {
          console.warn("No reviews found to display.");
        }
      } else {
        console.error("Failed to fetch reviews or invalid data format:", res);
        this.testimonials = []; // Clear testimonials on error
      }
    });
  }

  // Helper function to generate a placeholder image URL
  generatePlaceholderImage(name: string, index: number): string {
    const colors = ['FF5733', '33FF57', '3357FF', 'FF33CC', '57FF33', 'CC33FF'];
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
    const color = colors[index % colors.length];
    return 'https://6671704.fs1.hubspotusercontent-eu1.net/hubfs/6671704/Page-001-7.jpg';
  }


  startAutoSlide(): void {
    // Only start if not already running and there are testimonials
    if (!this.intervalId && this.testimonials.length > 0) {
      this.intervalId = setInterval(() => {
        this.nextTestimonial();
      }, 3000); // Change every 3 seconds
    }
  }

  stopAutoSlide(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null; // Reset intervalId
    }
  }

  nextTestimonial(): void {
    if (this.testimonials.length === 0) return; // Prevent errors if no testimonials
    this.currentTestimonialIndex = (this.currentTestimonialIndex + 1) % this.testimonials.length;
  }

  goToTestimonial(index: number): void {
    if (this.currentTestimonialIndex !== index && index >= 0 && index < this.testimonials.length) {
      this.currentTestimonialIndex = index;
      this.stopAutoSlide();
      this.startAutoSlide();
    }
  }
}
