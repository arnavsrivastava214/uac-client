import { CommonModule } from '@angular/common';
import {
  Component, OnInit, OnDestroy, ChangeDetectionStrategy,
  ChangeDetectorRef, HostListener, ViewChild, ElementRef
} from '@angular/core';
import { HeaderComponent } from "../../headers/header/header.component";
import { FooterComponent } from "../../footer/footer.component";
import { AdminPostService } from '../../services/admin-post.service';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';

interface GalleryImage {
  id: number;
  src: string;        // full size (w_1200)
  thumb: string;       // thumbnail (w_400)
  width: number;       // placeholder, will be updated after load
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
export class PhotoGalleryComponent implements OnInit, OnDestroy {
  @ViewChild('gridContainer', { static: true }) gridContainer!: ElementRef<HTMLElement>;

  allImages: GalleryImage[] = [];
  loading = true;
  error: string | null = null;

  // Zoomable grid variables
  private baseThumbSize = 150;           // base width in px
  private minThumbSize = 80;
  private maxThumbSize = 300;
  zoomLevel = 1.0;
  thumbSize = this.baseThumbSize;        // current size = base * zoomLevel (clamped)

  // Touch pinch tracking
  private touchDistanceStart = 0;
  private zoomLevelStart = 1.0;

  private lightbox: PhotoSwipeLightbox | null = null;

  constructor(
    private adminPostService: AdminPostService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchImages();
  }

  ngOnDestroy(): void {
    this.lightbox?.destroy();
  }

  private fetchImages(): void {
    this.adminPostService.getAdminGallery().subscribe({
      next: (res: any[]) => {
        this.allImages = res.map(item => ({
          id: item.id,
          src: this.optimizeCloudinaryUrl(item.imageUrl, 1200),
          thumb: this.optimizeCloudinaryUrl(item.imageUrl, 400),
          width: 1200,   // will be updated after load
          height: 800,
        }));
        this.loading = false;
        this.updateGridZoom();               // set initial CSS variable
        this.initPhotoSwipe();
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

  // --- Zoomable Grid Logic ---
  private updateGridZoom(): void {
    // Clamp thumbSize between min and max
    this.thumbSize = Math.min(this.maxThumbSize, Math.max(this.minThumbSize, this.baseThumbSize * this.zoomLevel));
    // Set CSS variable on the grid container
    this.gridContainer.nativeElement.style.setProperty('--thumb-size', `${this.thumbSize}px`);
  }

  // Touch pinch handlers
  @HostListener('touchstart', ['$event'])
  onTouchStart(e: TouchEvent) {
    if (e.touches.length === 2) {
      e.preventDefault();
      const distance = this.getTouchDistance(e.touches);
      this.touchDistanceStart = distance;
      this.zoomLevelStart = this.zoomLevel;
    }
  }

  @HostListener('touchmove', ['$event'])
  onTouchMove(e: TouchEvent) {
    if (e.touches.length === 2) {
      e.preventDefault();
      const distance = this.getTouchDistance(e.touches);
      if (this.touchDistanceStart > 0) {
        const scale = distance / this.touchDistanceStart;
        let newZoom = this.zoomLevelStart * scale;
        // Clamp zoom level to reasonable limits (so thumbSize stays within min/max)
        const minZoom = this.minThumbSize / this.baseThumbSize;
        const maxZoom = this.maxThumbSize / this.baseThumbSize;
        newZoom = Math.min(maxZoom, Math.max(minZoom, newZoom));
        this.zoomLevel = newZoom;
        this.updateGridZoom();
        this.cdr.markForCheck();
      }
    }
  }

  @HostListener('touchend')
  onTouchEnd() {
    this.touchDistanceStart = 0;
  }

  private getTouchDistance(touches: TouchList): number {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  // Wheel zoom (desktop, with Ctrl key)
  @HostListener('wheel', ['$event'])
  onWheel(e: WheelEvent) {
    if (!e.ctrlKey) return;
    e.preventDefault();
    const delta = -e.deltaY * 0.001;   // sensitivity
    const minZoom = this.minThumbSize / this.baseThumbSize;
    const maxZoom = this.maxThumbSize / this.baseThumbSize;
    let newZoom = this.zoomLevel + delta;
    newZoom = Math.min(maxZoom, Math.max(minZoom, newZoom));
    this.zoomLevel = newZoom;
    this.updateGridZoom();
    this.cdr.markForCheck();
  }

  // --- PhotoSwipe Initialization ---
  private initPhotoSwipe(): void {
    if (this.lightbox) {
      this.lightbox.destroy();
    }

    this.lightbox = new PhotoSwipeLightbox({
      gallery: '#gallery-grid',
      children: '.gallery-item',
      thumbSelector: '.gallery-thumb',
      pswpModule: () => import('photoswipe'),
      bgOpacity: 0.98,
      loop: true,                       // continuous navigation
      wheelToZoom: true,                 // pinch to zoom on trackpad
      closeOnVerticalDrag: true,         // swipe down to close
      pinchToClose: false,               // keep true? usually pinch to close is off, we use swipe down
      doubleTapAction: 'zoom',    // double tap zooms in/out
      showHideAnimationType: 'zoom',
      preload: [1, 2],                   // preload neighbour images
      imageClickAction: 'close',          // optional: click to close
      tapAction: 'toggle-controls',       // show/hide UI on tap
    });

    // Map data to PhotoSwipe items
    this.lightbox.addFilter('itemData', (itemData, index) => {
      const image = this.allImages[index];
      return {
        ...itemData,
        src: image.src,
        msrc: image.thumb,
        alt: `Image ${image.id}`,
        width: image.width,
        height: image.height,
      };
    });

    this.lightbox.init();
  }

  // TrackBy for ngFor
  trackById(index: number, item: GalleryImage): number {
    return item.id;
  }
}