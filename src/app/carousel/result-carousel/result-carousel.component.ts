import { CommonModule, NgFor } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from "../../headers/header/header.component";
import { FooterComponent } from "../../footer/footer.component";

interface CarouselImage {
  src: string;
  alt: string;
}
@Component({
  selector: 'app-result-carousel',
  imports: [FormsModule, CommonModule, NgFor, HeaderComponent, FooterComponent],
  templateUrl: './result-carousel.component.html',
  styleUrl: './result-carousel.component.scss'
})
export class ResultCarouselComponent {
  images: CarouselImage[] = [
    { src: 'https://unstoppableacademicclasses.weebly.com/uploads/1/2/7/3/127366569/p29.png', alt: 'Client A achieved 200% growth' },
    { src: 'https://unstoppableacademicclasses.weebly.com/uploads/1/2/7/3/127366569/p21.png', alt: 'Team B increased productivity by 30%' },
    { src: 'https://unstoppableacademicclasses.weebly.com/uploads/1/2/7/3/127366569/p59.jpeg', alt: 'Individual C landed their dream job' },
    { src: 'https://unstoppableacademicclasses.weebly.com/uploads/1/2/7/3/127366569/p61.png', alt: 'Startup D secured funding after coaching' },
    { src: 'https://unstoppableacademicclasses.weebly.com/uploads/1/2/7/3/127366569/p60.png', alt: 'Our workshop boosted morale and collaboration' }
  ];

  currentIndex: number = 0;
  isPrev: boolean = false; // To control animation direction
  private intervalId: any;

  // Image Preview Modal properties
  showPreview: boolean = false;
  previewImageUrl: string = '';
  previewImageIndex: number = 0;

  constructor() { }

  ngOnInit(): void {
    this.startAutoplay();
  }

  ngOnDestroy(): void {
    this.stopAutoplay();
  }

  startAutoplay(): void {
    this.intervalId = setInterval(() => {
      this.nextImage();
    }, 5000); // Change image every 5 seconds
  }

  stopAutoplay(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  nextImage(): void {
    this.stopAutoplay(); // Stop autoplay on manual interaction
    this.isPrev = false;
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this.startAutoplay(); // Restart autoplay
  }

  prevImage(): void {
    this.stopAutoplay(); // Stop autoplay on manual interaction
    this.isPrev = true;
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    this.startAutoplay(); // Restart autoplay
  }

  goToImage(index: number): void {
    this.stopAutoplay(); // Stop autoplay on manual interaction
    // Determine animation direction
    if (index > this.currentIndex) {
      this.isPrev = false;
    } else if (index < this.currentIndex) {
      this.isPrev = true;
    }
    this.currentIndex = index;
    this.startAutoplay(); // Restart autoplay
  }

  // --- Image Preview Functions ---
  openPreview(index: number): void {
    this.stopAutoplay(); // Pause carousel when preview is open
    this.previewImageIndex = index;
    this.previewImageUrl = this.images[index].src;
    this.showPreview = true;
    document.body.style.overflow = 'hidden'; // Prevent scrolling background
  }

  closePreview(): void {
    this.showPreview = false;
    document.body.style.overflow = ''; // Restore scrolling
    this.startAutoplay(); // Resume carousel autoplay
  }

  nextPreviewImage(): void {
    this.previewImageIndex = (this.previewImageIndex + 1) % this.images.length;
    this.previewImageUrl = this.images[this.previewImageIndex].src;
  }

  prevPreviewImage(): void {
    this.previewImageIndex = (this.previewImageIndex - 1 + this.images.length) % this.images.length;
    this.previewImageUrl = this.images[this.previewImageIndex].src;
  }
}
