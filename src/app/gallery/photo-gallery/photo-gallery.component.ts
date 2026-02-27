import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, HostListener } from '@angular/core';
import { HeaderComponent } from "../../headers/header/header.component";
import { FooterComponent } from "../../footer/footer.component";
import { AdminPostService } from '../../services/admin-post.service';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';

// Define the gallery image model
interface GalleryImage {
  id: number;
  src: string;        // full size for lightbox (Cloudinary w_1200)
  thumb: string;       // thumbnail for grid (Cloudinary w_400)
  title?: string;      // optional title
}

@Component({
  selector: 'app-photo-gallery',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './photo-gallery.component.html',
  styleUrls: ['./photo-gallery.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush, // performance optimization
})
export class PhotoGalleryComponent implements OnInit, OnDestroy {
  allImages: GalleryImage[] = [];           // all fetched images
  displayedImages: GalleryImage[] = [];      // subset shown in grid
  imagesPerLoad = 12;                         // number per batch
  currentDisplayedCount = 0;
  loading = true;                              // show skeleton loader
  error: string | null = null;

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

  // Fetch images from API and map to GalleryImage model
  private fetchImages(): void {
    this.adminPostService.getAdminGallery().subscribe({
      next: (res: any[]) => {
        // Map API response to GalleryImage with Cloudinary optimizations
        this.allImages = res.map(item => ({
          id: item.id,
          src: this.optimizeCloudinaryUrl(item.imageUrl, 1200),
          thumb: this.optimizeCloudinaryUrl(item.imageUrl, 400),
          title: `Image ${item.id}` // you can customize title extraction if needed
        }));
        this.loading = false;
        this.loadMoreImages(); // initial batch
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

  // Cloudinary optimization: insert transformation parameters after '/upload/'
  private optimizeCloudinaryUrl(url: string, width: number): string {
    if (!url.includes('res.cloudinary.com')) return url; // fallback
    return url.replace('/upload/', `/upload/f_auto,q_auto,w_${width}/`);
  }

  // Load more images into displayedImages (for "Load More" button)
  loadMoreImages(): void {
    const start = this.currentDisplayedCount;
    const end = Math.min(start + this.imagesPerLoad, this.allImages.length);
    for (let i = start; i < end; i++) {
      this.displayedImages.push(this.allImages[i]);
    }
    this.currentDisplayedCount = this.displayedImages.length;
    this.cdr.markForCheck();
  }

  hasMoreImages(): boolean {
    return this.currentDisplayedCount < this.allImages.length;
  }

  // Initialize PhotoSwipe lightbox
  private initPhotoSwipe(): void {
    if (this.lightbox) {
      this.lightbox.destroy();
    }

    this.lightbox = new PhotoSwipeLightbox({
      gallery: '#gallery-grid',           // container selector
      children: '.gallery-item',           // individual items
      thumbSelector: '.gallery-thumb',     // element with thumbnail
      pswpModule: () => import('photoswipe'),
      bgOpacity: 0.95,
      loop: false,
      wheelToZoom: true,                    // pinch zoom support
      closeOnVerticalDrag: true,             // swipe down to close
      showHideAnimationType: 'zoom',
      preload: [1, 2],                       // preload neighbour images
    });

    // Map our data to PhotoSwipe item structure
    this.lightbox.addFilter('itemData', (itemData, index) => {
      const image = this.allImages[index];
      return {
        ...itemData,
        src: image.src,
        msrc: image.thumb,   // thumbnail shown while loading full
        alt: image.title,
        width: 1200,          // approximate; you could fetch real dimensions
        height: 800,
      };
    });

    this.lightbox.init();
  }

  // TrackBy for ngFor performance
  trackById(index: number, item: GalleryImage): number {
    return item.id;
  }

  // Keyboard escape – PhotoSwipe already handles it, but we keep fallback
  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.lightbox?.pswp) {
      this.lightbox.pswp.close();
    }
  }
}