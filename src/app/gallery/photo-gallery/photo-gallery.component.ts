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
  thumbSize = 150;
  
  // --- PREVIEW STATE ---
  selectedImageIndex: number | null = null;
  protected readonly Math = Math; // Template Error Fix
  
  // Swipe Logic
  isDragging = false;
  translateX = 0;
  translateY = 0;
  startX = 0;
  startY = 0;
  bgOpacity = 1;
  windowWidth = window.innerWidth;

  constructor(private adminPostService: AdminPostService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void { this.fetchImages(); }

  @HostListener('window:resize')
  onResize() { this.windowWidth = window.innerWidth; }

  private fetchImages(): void {
    this.adminPostService.getAdminGallery().subscribe({
      next: (res: any[]) => {
        this.allImages = res.map(item => ({
          id: item.id,
          src: item.imageUrl.replace('/upload/', `/upload/f_auto,q_auto,w_1200/`),
          thumb: item.imageUrl.replace('/upload/', `/upload/f_auto,q_auto,w_400/`),
        }));
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => { this.loading = false; this.cdr.markForCheck(); }
    });
  }

  openPreview(index: number) {
    this.selectedImageIndex = index;
    this.translateX = 0;
    this.translateY = 0;
    this.bgOpacity = 1;
    document.body.style.overflow = 'hidden';
    this.cdr.markForCheck();
  }

  closePreview() {
    this.selectedImageIndex = null;
    document.body.style.overflow = '';
    this.cdr.markForCheck();
  }

  onSwipeStart(event: TouchEvent | MouseEvent) {
    this.isDragging = true;
    this.startX = event instanceof TouchEvent ? event.touches[0].clientX : event.clientX;
    this.startY = event instanceof TouchEvent ? event.touches[0].clientY : event.clientY;
  }

  onSwipeMove(event: TouchEvent | MouseEvent) {
    if (!this.isDragging) return;
    const x = event instanceof TouchEvent ? event.touches[0].clientX : event.clientX;
    const y = event instanceof TouchEvent ? event.touches[0].clientY : event.clientY;

    this.translateX = x - this.startX;
    this.translateY = y - this.startY;

    const absX = Math.abs(this.translateX);
    const absY = Math.abs(this.translateY);

    // Vertical Drag (Close Logic)
    if (absY > absX && this.translateY > 0) {
      this.bgOpacity = Math.max(0.4, 1 - (this.translateY / 600));
    } else {
      this.bgOpacity = 1;
    }
    this.cdr.detectChanges();
  }

  onSwipeEnd() {
    if (!this.isDragging) return;
    this.isDragging = false;

    const absX = Math.abs(this.translateX);
    const absY = Math.abs(this.translateY);
    const threshold = this.windowWidth * 0.15; // 15% swipe needed

    if (absY > absX && this.translateY > 120) {
      this.closePreview();
    } else if (absX > absY && absX > threshold) {
      if (this.translateX < 0 && this.selectedImageIndex! < this.allImages.length - 1) {
        this.selectedImageIndex!++;
      } else if (this.translateX > 0 && this.selectedImageIndex! > 0) {
        this.selectedImageIndex!--;
      }
    }
    this.translateX = 0;
    this.translateY = 0;
    this.cdr.markForCheck();
  }

  trackById(index: number, item: GalleryImage) { return item.id; }
}