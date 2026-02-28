import { CommonModule } from '@angular/common';
import {
  Component, OnInit, ChangeDetectionStrategy,
  ChangeDetectorRef, HostListener, ViewChild, ElementRef
} from '@angular/core';
import { HeaderComponent } from "../../headers/header/header.component";
import { FooterComponent } from "../../footer/footer.component";
import { AdminPostService } from '../../services/admin-post.service';

interface GalleryImage {
  id: number;
  src: string;
  thumb: string;
  width: number;
  height: number;
}

@Component({
  selector: 'app-photo-gallery',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './photo-gallery.component.html',
  styleUrls: ['./photo-gallery.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoGalleryComponent implements OnInit {
  @ViewChild('gridContainer', { static: false }) gridContainer!: ElementRef<HTMLElement>;

  allImages: GalleryImage[] = [];
  loading = true;
  error: string | null = null;

  // Zoom Grid Variables
  private baseThumbSize = 150;
  private minThumbSize = 80;
  private maxThumbSize = 300;
  zoomLevel = 1.0;
  thumbSize = this.baseThumbSize;

  // --- FULLSCREEN PREVIEW VARIABLES ---
  selectedImageIndex: number | null = null;
  
  // Touch Mechanics Variables
  private startX = 0;
  private startY = 0;
  translateX = 0;
  translateY = 0;
  isDragging = false;
  bgOpacity = 1;

  constructor(
    private adminPostService: AdminPostService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchImages();
  }

  private fetchImages(): void {
    this.adminPostService.getAdminGallery().subscribe({
      next: (res: any[]) => {
        this.allImages = res.map(item => ({
          id: item.id,
          src: this.optimizeCloudinaryUrl(item.imageUrl, 1200),
          thumb: this.optimizeCloudinaryUrl(item.imageUrl, 400),
          width: 1200,
          height: 800,
        }));
        this.loading = false;
        this.updateGridZoom();
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Failed to load images', err);
        this.error = 'Could not load gallery. Please try again later.';
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  private optimizeCloudinaryUrl(url: string, width: number): string {
    if (!url.includes('res.cloudinary.com')) return url;
    return url.replace('/upload/', `/upload/f_auto,q_auto,w_${width}/`);
  }

  private updateGridZoom(): void {
    this.thumbSize = Math.min(this.maxThumbSize, Math.max(this.minThumbSize, this.baseThumbSize * this.zoomLevel));
    if (this.gridContainer) {
      this.gridContainer.nativeElement.style.setProperty('--thumb-size', `${this.thumbSize}px`);
    }
  }

  // --- NATIVE GALLERY PREVIEW LOGIC ---

  openPreview(index: number) {
    this.selectedImageIndex = index;
    this.resetTransform();
    // Scroll Lock
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100vh';
    this.cdr.markForCheck();
  }
  
  closePreview() {
    this.selectedImageIndex = null;
    // Scroll Restore
    document.body.style.overflow = '';
    document.body.style.height = '';
    this.cdr.markForCheck();
  }

  nextImage() {
    if (this.selectedImageIndex !== null && this.selectedImageIndex < this.allImages.length - 1) {
      this.selectedImageIndex++;
      this.resetTransform();
    } else {
      this.resetTransform(); // Bounce back if last image
    }
  }

  prevImage() {
    if (this.selectedImageIndex !== null && this.selectedImageIndex > 0) {
      this.selectedImageIndex--;
      this.resetTransform();
    } else {
      this.resetTransform(); // Bounce back if first image
    }
  }

  // --- TOUCH GESTURES LOGIC ---

  // --- MOUSE & TOUCH COMBINED LOGIC ---

// Start (Mouse Click ya Touch Start)
onSwipeStart(event: TouchEvent | MouseEvent) {
  this.isDragging = true;
  if (event instanceof TouchEvent) {
    this.startX = event.touches[0].clientX;
    this.startY = event.touches[0].clientY;
  } else {
    this.startX = event.clientX;
    this.startY = event.clientY;
  }
}

// Move (Mouse Drag ya Touch Move)
onSwipeMove(event: TouchEvent | MouseEvent) {
  if (!this.isDragging) return;

  let currentX, currentY;
  if (event instanceof TouchEvent) {
    currentX = event.touches[0].clientX;
    currentY = event.touches[0].clientY;
  } else {
    currentX = event.clientX;
    currentY = event.clientY;
  }

  this.translateX = currentX - this.startX;
  this.translateY = currentY - this.startY;

  if (this.translateY > 0) {
    this.bgOpacity = Math.max(0.3, 1 - (this.translateY / (window.innerHeight / 2)));
  }
  this.cdr.markForCheck();
}

// End (Mouse Up ya Touch End)
onSwipeEnd() {
  if (!this.isDragging) return;
  this.isDragging = false;

  const SWIPE_DOWN_THRESHOLD = 120;
  const SWIPE_SIDE_THRESHOLD = 80;

  if (this.translateY > SWIPE_DOWN_THRESHOLD) {
    this.closePreview();
  } else if (this.translateX < -SWIPE_SIDE_THRESHOLD) {
    this.nextImage();
  } else if (this.translateX > SWIPE_SIDE_THRESHOLD) {
    this.prevImage();
  } else {
    this.resetTransform();
  }
}

  private resetTransform() {
    this.translateX = 0;
    this.translateY = 0;
    this.bgOpacity = 1;
    this.cdr.markForCheck();
  }

  trackById(index: number, item: GalleryImage): number {
    return item.id;
  }
}