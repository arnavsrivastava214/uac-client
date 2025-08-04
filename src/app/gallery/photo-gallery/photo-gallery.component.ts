import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { HeaderComponent } from "../../headers/header/header.component";
interface GalleryImage {
  url: string;
  alt: string;
  title?: string;
  description?: string;
  gridHeightClass?: string; // Optional: Add a property to hint at desired display height in the grid
}



@Component({
  selector: 'app-photo-gallery',
  imports: [CommonModule, HeaderComponent],
  templateUrl: './photo-gallery.component.html',
  styleUrl: './photo-gallery.component.scss'
})
export class PhotoGalleryComponent {
  allImages: GalleryImage[] = [];
  // This array will be used for displaying images in the grid
  displayedImages: GalleryImage[] = [];
  // Controls how many images are shown initially and loaded per "Load More" click
  imagesPerLoad: number = 4;
  // Keeps track of the total images currently displayed
  currentDisplayedCount: number = 0;


  isLightboxOpen: boolean = false;
  currentImageIndex: number = 0;
  selectedImage: GalleryImage | null = null;
  isLightboxImageLoading: boolean = true;

  constructor() { }

  ngOnInit(): void {
    // Populate allImages with coaching-themed image data
    this.allImages = [
      {
        url: 'assets/myallimages/IMG-20250801-WA0053.jpg',
        alt: 'Interactive Session',
        title: 'Engaging Classroom',
        description: 'Students actively participating during a live concept discussion.',
        gridHeightClass: 'h-80'
      },
      {
        url: 'assets/myallimages/IMG-20250801-WA0005.jpg',
        alt: 'Focused Student',
        title: 'Deep Concentration',
        description: 'A learner deeply focused during a mock test session.',
        gridHeightClass: 'h-96'
      },
      {
        url: 'assets/myallimages/IMG-20250801-WA0003.jpg',
        alt: 'Mentor Teaching',
        title: 'Expert Guidance',
        description: 'Our faculty explaining core concepts with clarity and real-life examples.',
        gridHeightClass: 'h-72'
      },
      {
        url: 'assets/myallimages/IMG-20250801-WA0006.jpg',
        alt: 'Group Study',
        title: 'Peer Learning',
        description: 'Collaborative learning through group discussions and teamwork.',
        gridHeightClass: 'h-80'
      },
      {
        url: 'assets/myallimages/IMG-20250801-WA0008.jpg',
        alt: 'Test Practice',
        title: 'Practice Session',
        description: 'A student solving previous year papers during a timed test.',
        gridHeightClass: 'h-96'
      },
      {
        url: 'assets/myallimages/IMG-20250801-WA0007.jpg',
        alt: 'Motivational Talk',
        title: 'Power Session',
        description: 'A motivational lecture by the director to boost confidence and vision.',
        gridHeightClass: 'h-72'
      },
      {
        url: 'assets/myallimages/IMG-20250801-WA0009.jpg',
        alt: 'Doubt Solving',
        title: 'One-on-One Mentoring',
        description: 'Mentors resolving student doubts personally after class.',
        gridHeightClass: 'h-80'
      },
      {
        url: 'assets/myallimages/IMG-20250801-WA0010.jpg',
        alt: 'Study Break Area',
        title: 'Calm Corners',
        description: 'A peaceful zone for students to relax and refocus.',
        gridHeightClass: 'h-96'
      },
      {
        url: 'assets/myallimages/IMG-20250801-WA0011.jpg',
        alt: 'Coaching Session',
        title: 'Driven Environment',
        description: 'A classroom where every student is focused on growth.',
        gridHeightClass: 'h-72'
      },
      {
        url: 'assets/myallimages/IMG-20250801-WA0012.jpg',
        alt: 'Celebrating Success',
        title: 'Achiever’s Wall',
        description: 'Moments of appreciation for top performers in recent tests.',
        gridHeightClass: 'h-80'
      },
      {
        url: 'assets/myallimages/IMG-20250801-WA0013.jpg',
        alt: 'Focused Writing',
        title: 'Dedicated Practice',
        description: 'Daily writing tasks help students develop better retention.',
        gridHeightClass: 'h-72'
      },
      {
        url: 'assets/myallimages/IMG-20250801-WA0014.jpg',
        alt: 'Student Reflection',
        title: 'Self-Improvement Time',
        description: 'Quiet moments where students analyze their progress.',
        gridHeightClass: 'h-96'
      },
      {
        url: 'assets/myallimages/IMG-20250801-WA0015.jpg',
        alt: 'Positive Ambience',
        title: 'Bright Learning Space',
        description: 'Natural light and greenery uplift student moods and focus.',
        gridHeightClass: 'h-96'
      },
      {
        url: 'assets/myallimages/IMG-20250801-WA0016.jpg',
        alt: 'Peaceful Corridor',
        title: 'Growth Hallway',
        description: 'Every corner is designed to motivate and inspire learning.',
        gridHeightClass: 'h-96'
      },
      {
        url: 'assets/myallimages/IMG-20250801-WA0034.jpg',
        alt: 'Inspiring Entrance',
        title: 'Welcoming Ambience',
        description: 'Entrance filled with energy and student achievements.',
        gridHeightClass: 'h-96'
      },
      {
        url: 'assets/myallimages/IMG-20250801-WA0035.jpg',
        alt: 'Vision Wall',
        title: 'Dreams Begin Here',
        description: 'Our vision wall reminds students to stay consistent and ambitious.',
        gridHeightClass: 'h-96'
      },
      {
        url: 'assets/myallimages/IMG-20250801-WA0033.jpg',
        alt: 'Learning Vibes',
        title: 'Uplifting Energy',
        description: 'An atmosphere filled with learning, laughter, and leadership.',
        gridHeightClass: 'h-96'
      },
      {
        url: 'assets/myallimages/IMG-20250801-WA0020.jpg',
        alt: 'Results Day',
        title: 'Moments of Joy',
        description: 'Celebrating the fruits of hard work as results are announced.',
        gridHeightClass: 'h-96'
      },
      {
        url: 'assets/myallimages/IMG-20250801-WA0032.jpg',
        alt: 'UAC Values',
        title: 'Discipline & Drive',
        description: 'A corridor that reflects our institute’s core values.',
        gridHeightClass: 'h-96'
      },
      {
        url: 'assets/myallimages/IMG-20250801-WA0022.jpg',
        alt: 'Creative Notes',
        title: 'Learning Tools',
        description: 'Creative handwritten notes that aid fast recall and clarity.',
        gridHeightClass: 'h-96'
      },
      {
        url: 'assets/myallimages/IMG-20250801-WA0023.jpg',
        alt: 'Student Initiative',
        title: 'Driven by Purpose',
        description: 'Students voluntarily solving questions and helping peers.',
        gridHeightClass: 'h-96'
      },
      {
        url: 'assets/myallimages/IMG-20250801-WA0036.jpg',
        alt: 'Interactive Whiteboard',
        title: 'Smart Class Setup',
        description: 'Our smart boards help bring abstract concepts to life.',
        gridHeightClass: 'h-96'
      },
      {
        url: 'assets/myallimages/IMG-20250801-WA0025.jpg',
        alt: 'Quiet Study Zone',
        title: 'Self-Study Area',
        description: 'Dedicated space where students can focus without distractions.',
        gridHeightClass: 'h-96'
      },
      {
        url: 'assets/myallimages/IMG-20250801-WA0037.jpg',
        alt: 'Positive Energy',
        title: 'Inspired Minds',
        description: 'Walls filled with motivational quotes and student messages.',
        gridHeightClass: 'h-96'
      },
      {
        url: 'assets/myallimages/IMG-20250801-WA0038.jpg',
        alt: 'Confident Speaker',
        title: 'Public Speaking',
        description: 'Building confidence through regular communication sessions.',
        gridHeightClass: 'h-96'
      },
    ];
  
    // Initially load the first 'imagesPerLoad' images
    this.loadMoreImages();
  }
  

  // New method to load more images
  loadMoreImages(): void {
    const startIndex = this.currentDisplayedCount;
    const endIndex = Math.min(startIndex + this.imagesPerLoad, this.allImages.length);

    for (let i = startIndex; i < endIndex; i++) {
      this.displayedImages.push(this.allImages[i]);
    }
    this.currentDisplayedCount = this.displayedImages.length;
  }

  // Check if there are more images to load
  hasMoreImages(): boolean {
    return this.currentDisplayedCount < this.allImages.length;
  }

  openLightbox(index: number): void {
    // When opening lightbox from the main grid, use the index relative to 'allImages'
    // This is crucial because 'displayedImages' might be a subset
    this.currentImageIndex = index;
    this.selectedImage = this.allImages[index]; // Use allImages here
    this.isLightboxOpen = true;
    this.isLightboxImageLoading = true;
    document.body.style.overflow = 'hidden';
  }

  closeLightbox(): void {
    this.isLightboxOpen = false;
    this.selectedImage = null;
    document.body.style.overflow = '';
  }

  nextImage(): void {
    this.isLightboxImageLoading = true;
    this.currentImageIndex = (this.currentImageIndex + 1) % this.allImages.length; // Use allImages.length
    this.selectedImage = this.allImages[this.currentImageIndex]; // Use allImages
  }

  prevImage(): void {
    this.isLightboxImageLoading = true;
    this.currentImageIndex = (this.currentImageIndex - 1 + this.allImages.length) % this.allImages.length; // Use allImages.length
    this.selectedImage = this.allImages[this.currentImageIndex]; // Use allImages
  }

  onImageLoad(): void {
    this.isLightboxImageLoading = false;
  }

  getFilmstripImages(): { image: GalleryImage, index: number }[] {
    const filmstripCount = 4;
    // For filmstrip, always use the full 'allImages' array
    let startIndex = Math.max(0, this.currentImageIndex - Math.floor(filmstripCount / 2));
    let endIndex = Math.min(this.allImages.length, startIndex + filmstripCount);

    if (endIndex - startIndex < filmstripCount && this.allImages.length >= filmstripCount) {
        startIndex = Math.max(0, this.allImages.length - filmstripCount);
        endIndex = this.allImages.length;
    }

    const filmstripImages: { image: GalleryImage, index: number }[] = [];
    for (let i = startIndex; i < endIndex; i++) {
        filmstripImages.push({ image: this.allImages[i], index: i });
    }
    return filmstripImages;
  }

  goToImage(index: number): void {
    if (index >= 0 && index < this.allImages.length && index !== this.currentImageIndex) {
      this.openLightbox(index);
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (!this.isLightboxOpen) return;

    if (event.key === 'ArrowRight') {
      this.nextImage();
    } else if (event.key === 'ArrowLeft') {
      this.prevImage();
    } else if (event.key === 'Escape') {
      this.closeLightbox();
    }
  }
}