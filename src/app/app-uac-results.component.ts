import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  OnDestroy,
  ViewChild,
  AfterViewInit,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationServiceService } from './services/application-service.service';
import { FormsModule } from '@angular/forms';

interface MediaItem {
  id: number;
  src: string;
  title: string | null;
  description: string | null;
  original_name: string;
  created_at: string;
  type: 'image' | 'video';
}

@Component({
  selector: 'app-uac-results',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div
      class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div class="text-center mb-12">
          <h1
            class="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4"
          >
            UAC Results Gallery
          </h1>
          <p class="text-gray-600 text-lg max-w-3xl mx-auto">
            Celebrating the success stories of our unstoppable students at
            Unstoppable Academic Classes
          </p>
          <div class="mt-4 text-sm text-gray-500">
            {{ filteredPhotos().length }} photos available
          </div>
        </div>

        <!-- Search and Filter -->
        <div class="mb-8 max-w-2xl mx-auto">
          <div class="relative">
            <input
              type="text"
              [(ngModel)]="searchQuery"
              placeholder="Search photos by name..."
              class="w-full px-6 py-4 rounded-2xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-300 shadow-sm"
            />
            <div class="absolute right-3 top-1/2 transform -translate-y-1/2">
              🔍
            </div>
          </div>
          
          <!-- Sort Options -->
          <div class="flex justify-center gap-4 mt-4">
            <button
              (click)="sortBy = 'date'"
              [class]="getSortButtonClass('date')"
            >
              📅 Newest First
            </button>
            <button
              (click)="sortBy = 'name'"
              [class]="getSortButtonClass('name')"
            >
              🔤 Sort by Name
            </button>
          </div>
        </div>

        <!-- Tabs -->
        <div class="flex justify-center mb-10">
          <div
            class="bg-white/80 backdrop-blur-sm rounded-2xl p-1.5 shadow-lg inline-flex"
          >
            <button
              (click)="activeTab = 'photos'"
              [class]="getTabClasses('photos')"
            >
              <span class="mr-2">📸</span>
              Photos Gallery ({{ filteredPhotos().length }})
            </button>
            <button
              (click)="activeTab = 'videos'"
              [class]="getTabClasses('videos')"
            >
              <span class="mr-2">🎥</span>
              Video Highlights
            </button>
          </div>
        </div>

        <!-- Loading State -->
        @if (isLoading()) {
        <div class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p class="text-gray-600">Loading gallery...</p>
        </div>
        }

        <!-- Error State -->
        @if (error()) {
        <div class="bg-red-50 border border-red-200 rounded-xl p-6 text-center mb-8">
          <p class="text-red-600 font-medium">⚠️ {{ error() }}</p>
          <button 
            (click)="loadPhotos()"
            class="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
        }

        <!-- Empty State -->
        @if (!isLoading() && filteredPhotos().length === 0 && activeTab === 'photos') {
        <div class="text-center py-12">
          <div class="text-6xl mb-4">📷</div>
          <h3 class="text-xl font-semibold text-gray-700 mb-2">No photos found</h3>
          <p class="text-gray-500">Try adjusting your search or check back later</p>
        </div>
        }

        <!-- Carousel Container -->
        @if (filteredPhotos().length > 0 && activeTab === 'photos') {
        <div
          class="relative bg-white/60 backdrop-blur-lg rounded-3xl shadow-2xl p-6 md:p-8 border border-white/20"
        >
          <!-- Navigation Buttons -->
          <button
            (click)="prevSlide()"
            class="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-xl rounded-full p-3 transition-all duration-300 hover:scale-110 -translate-x-1/2 md:translate-x-0"
            aria-label="Previous slide"
            [disabled]="currentSlide === 0"
          >
            <svg
              class="w-6 h-6 text-gray-800"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            (click)="nextSlide()"
            class="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-xl rounded-full p-3 transition-all duration-300 hover:scale-110 translate-x-1/2 md:translate-x-0"
            aria-label="Next slide"
            [disabled]="currentSlide === getPaginationDots().length - 1"
          >
            <svg
              class="w-6 h-6 text-gray-800"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          <!-- Carousel Track -->
          <div
            #carouselTrack
            class="overflow-hidden rounded-2xl"
            (touchstart)="onTouchStart($event)"
            (touchmove)="onTouchMove($event)"
            (touchend)="onTouchEnd()"
          >
            <div
              class="flex transition-transform duration-500 ease-out"
              [style.transform]="'translateX(' + currentTranslate + '%)'"
            >
              @for (item of filteredPhotos(); track item.id; let i = $index) {
              <div class="px-3 flex-shrink-0" [style.width]="getSlideWidth()">
                <div
                  class="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
                  (click)="openPreview(i)"
                >
                  <!-- Photo Card -->
                  <div class="relative aspect-[4/3] overflow-hidden">
                    <img
                      [src]="item.src"
                      [alt]="item.original_name || 'UAC Result Photo'"
                      loading="lazy"
                      decoding="async"
                      class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      (load)="onImageLoad(item.src)"
                      (error)="onImageError($event, item)"
                    />

                    <!-- Skeleton Loader -->
                    @if (!imageLoaded.has(item.src)) {
                    <div
                      class="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse"
                    ></div>
                    }

                    <!-- Date Badge -->
                    @if (item.created_at) {
                    <div class="absolute top-3 left-3 bg-black/70 text-white text-xs px-2 py-1 rounded-lg">
                      {{ formatDate(item.created_at) }}
                    </div>
                    }
                  </div>

                  <!-- Card Content -->
                  <div class="p-6">
                    <h3
                      class="text-xl font-bold text-gray-800 mb-2 line-clamp-1"
                    >
                      {{ getPhotoTitle(item) }}
                    </h3>
                    <p class="text-gray-600 line-clamp-2">{{ getPhotoDescription(item) }}</p>
                    <div class="mt-4 flex items-center justify-between">
                      <span
                        class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-600"
                      >
                        📸 {{ getFileType(item.original_name) }}
                      </span>
                      <div class="text-sm text-gray-500">
                        ID: {{ item.id }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              }
            </div>
          </div>

          <!-- Pagination Dots -->
          <div class="flex justify-center items-center mt-8 space-x-2">
            @for (dot of getPaginationDots(); track dot) {
            <button
              (click)="goToSlide(dot)"
              [class]="getDotClasses(dot)"
              [attr.aria-label]="'Go to slide ' + (dot + 1)"
            ></button>
            }
          </div>

          <!-- CTAs -->
          <div
            class="flex flex-col sm:flex-row justify-center items-center gap-4 mt-10 pt-8 border-t border-gray-200/50"
          >
            <button
              class="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105"
              (click)="downloadAllPhotos()"
            >
              ⬇️ Download All Photos
            </button>
            <button
              class="px-8 py-3 bg-white text-gray-800 border border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300"
              (click)="shareGallery()"
            >
              🔗 Share Gallery
            </button>
          </div>
        </div>
        }

        <!-- Video Tab Content -->
        @if (activeTab === 'videos') {
        <div class="text-center py-12">
          <div class="text-6xl mb-4">🎬</div>
          <h3 class="text-2xl font-bold text-gray-800 mb-3">Video Gallery Coming Soon!</h3>
          <p class="text-gray-600 max-w-md mx-auto">
            We're working on compiling video highlights of our students' success stories.
            Check back soon!
          </p>
        </div>
        }

        <!-- Stats -->
        <div class="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div
            class="bg-white/70 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg"
          >
            <div class="text-3xl font-bold text-blue-600 mb-2">{{ totalPhotos() }}</div>
            <div class="text-gray-600">Total Photos</div>
          </div>
          <div
            class="bg-white/70 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg"
          >
            <div class="text-3xl font-bold text-purple-600 mb-2">{{ latestDate() | date:'MMM yyyy' }}</div>
            <div class="text-gray-600">Latest Update</div>
          </div>
          <div
            class="bg-white/70 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg"
          >
            <div class="text-3xl font-bold text-green-600 mb-2">{{ uniqueDays() }}</div>
            <div class="text-gray-600">Days of Success</div>
          </div>
          <div
            class="bg-white/70 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg"
          >
            <div class="text-3xl font-bold text-orange-600 mb-2">{{ jpegCount() }}</div>
            <div class="text-gray-600">JPEG Images</div>
          </div>
        </div>

        <!-- Info Panel -->
        <div class="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <h4 class="text-lg font-semibold text-blue-800 mb-2">ℹ️ Gallery Information</h4>
          <ul class="text-sm text-blue-700 space-y-1">
            <li>• All photos are uploaded to Cloudinary for fast loading</li>
            <li>• Click any photo to view in full-screen mode</li>
            <li>• Use arrow keys or swipe to navigate</li>
            <li>• Press ESC to exit full-screen view</li>
            <li>• Photos are sorted by date (newest first)</li>
          </ul>
        </div>
      </div>

      <!-- Preview Modal -->
      @if (showPreview) {
      <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm transition-opacity duration-300"
        (click)="closePreview()"
      >
        <div
          class="relative w-full h-full max-w-7xl mx-auto p-4 flex items-center justify-center"
          (click)="$event.stopPropagation()"
        >
          <!-- Close Button -->
          <button
            (click)="closePreview()"
            class="absolute top-4 right-4 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-300 hover:scale-110"
            aria-label="Close preview"
          >
            <svg
              class="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <!-- Navigation in Modal -->
          <button
            (click)="modalPrev()"
            class="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-300 hover:scale-110"
            aria-label="Previous"
          >
            <svg
              class="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            (click)="modalNext()"
            class="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-300 hover:scale-110"
            aria-label="Next"
          >
            <svg
              class="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          <!-- Download Button -->
          <button
            (click)="downloadCurrentPhoto()"
            class="absolute top-4 left-4 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-300 hover:scale-110"
            aria-label="Download photo"
          >
            <svg
              class="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </button>

          <!-- Media Content -->
          <div class="w-full max-w-6xl mx-auto">
            <div class="flex flex-col items-center">
              <!-- Media Container -->
              <div
                class="relative w-full max-w-5xl mx-auto rounded-2xl overflow-hidden bg-black/50"
              >
                @if (currentPhoto()) {
                <img
                  [src]="currentPhoto()?.src"
                  [alt]="currentPhoto()?.original_name || 'UAC Result Photo'"
                  class="w-full h-auto max-h-[70vh] object-contain mx-auto"
                  (error)="onImageError($event, currentPhoto())"
                />
                }
              </div>

              <!-- Caption -->
              @if (currentPhoto()) {
              <div class="mt-6 text-center max-w-3xl">
                <h3 class="text-2xl font-bold text-white mb-2">
                  {{ getPhotoTitle(currentPhoto()!) }}
                </h3>
                <p class="text-gray-300 text-lg mb-4">
                  {{ getPhotoDescription(currentPhoto()!) }}
                </p>
                <div class="flex flex-col sm:flex-row justify-center items-center gap-4 text-sm text-gray-400">
                  @if (currentPhoto()?.created_at) {
                  <div>
                    <span class="font-medium">Uploaded:</span> 
                    {{ formatDate(currentPhoto()!.created_at) }}
                  </div>
                  }
                  @if (currentPhoto()?.original_name) {
                  <div class="hidden sm:block">•</div>
                  <div>
                    <span class="font-medium">File:</span> 
                    {{ currentPhoto()!.original_name }}
                  </div>
                  }
                  <div class="hidden sm:block">•</div>
                  <div>
                    <span class="font-medium">Size:</span> 
                    {{ getImageSize(currentPhoto()!) }}
                  </div>
                </div>
                <div class="mt-4 text-gray-400">
                  {{ currentPreviewIndex + 1 }} of {{ filteredPhotos().length }}
                </div>
              </div>
              }
            </div>
          </div>
        </div>
      </div>
      }
    </div>
  `,
  styles: [
    `
      .line-clamp-1 {
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
      }
      .line-clamp-2 {
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
      }
    `,
  ],
})
export class UacResultsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('carouselTrack') carouselTrack!: ElementRef;
  @ViewChild('previewVideo') previewVideo?: ElementRef<HTMLVideoElement>;

  activeTab: 'photos' | 'videos' = 'photos';
  currentSlide = 0;
  currentTranslate = 0;
  itemsPerView = 1;
  showPreview = false;
  currentPreviewIndex = 0;
  imageLoaded = new Set<string>();
  searchQuery = '';
  sortBy: 'date' | 'name' = 'date';

  // Touch/swipe support
  touchStartX = 0;
  touchEndX = 0;
  isSwiping = false;

  // Signals for reactive state
  isLoading = signal(false);
  error = signal<string | null>(null);
  photos = signal<MediaItem[]>([]);
  
  // Computed values
  filteredPhotos = computed(() => {
    let items = this.photos();
    
    // Apply search filter
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase().trim();
      items = items.filter(item => 
        item.original_name?.toLowerCase().includes(query) ||
        (item.title?.toLowerCase() || '').includes(query) ||
        (item.description?.toLowerCase() || '').includes(query)
      );
    }
    
    // Apply sorting
    if (this.sortBy === 'date') {
      items = [...items].sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    } else if (this.sortBy === 'name') {
      items = [...items].sort((a, b) => 
        (a.original_name || '').localeCompare(b.original_name || '')
      );
    }
    
    return items;
  });

  totalPhotos = computed(() => this.photos().length);
  
  latestDate = computed(() => {
    const items = this.photos();
    if (items.length === 0) return new Date();
    return new Date(Math.max(...items.map(item => new Date(item.created_at).getTime())));
  });
  
  uniqueDays = computed(() => {
    const dates = new Set(
      this.photos().map(item => 
        new Date(item.created_at).toDateString()
      )
    );
    return dates.size;
  });

  jpegCount = computed(() => {
    return this.photos().filter(item => 
      item.original_name?.toLowerCase().endsWith('.jpg') || 
      item.original_name?.toLowerCase().endsWith('.jpeg')
    ).length;
  });

  currentPhoto = computed(() => {
    return this.filteredPhotos()[this.currentPreviewIndex];
  });

  constructor(private appService: ApplicationServiceService) {}

  ngOnInit() {
    this.updateItemsPerView();
    window.addEventListener('resize', this.onResize.bind(this));
    this.loadPhotos();
  }

  ngAfterViewInit() {
    this.updateCarousel();
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.onResize.bind(this));
  }

  loadPhotos() {
    this.isLoading.set(true);
    this.error.set(null);
    
    this.appService.getResultImages((res: any) => {
      this.isLoading.set(false);
      
      if (res && res.data && Array.isArray(res.data)) {
        // Transform API data to MediaItem format
        const mediaItems: MediaItem[] = res.data.map((item: any) => ({
          id: item.id,
          src: item.src,
          title: item.title,
          description: item.description,
          original_name: item.original_name,
          created_at: item.created_at,
          type: 'image'
        }));
        
        this.photos.set(mediaItems);
        
        // Update carousel after data loads
        setTimeout(() => {
          this.updateItemsPerView();
          this.updateCarousel();
        }, 100);
      } else {
        this.error.set('Invalid data format received from server');
      }
    });
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardNavigation(event: KeyboardEvent) {
    if (this.showPreview) {
      if (event.key === 'Escape') {
        this.closePreview();
      } else if (event.key === 'ArrowLeft') {
        this.modalPrev();
      } else if (event.key === 'ArrowRight') {
        this.modalNext();
      } else if (event.key === ' ' || event.key === 'Spacebar') {
        event.preventDefault();
        this.modalNext();
      }
    } else {
      if (event.key === 'ArrowLeft') {
        this.prevSlide();
      } else if (event.key === 'ArrowRight') {
        this.nextSlide();
      }
    }
  }

  onResize() {
    this.updateItemsPerView();
    this.updateCarousel();
  }

  updateItemsPerView() {
    const width = window.innerWidth;
    if (width >= 1280) {
      this.itemsPerView = 4;
    } else if (width >= 1024) {
      this.itemsPerView = 3;
    } else if (width >= 768) {
      this.itemsPerView = 2;
    } else {
      this.itemsPerView = 1;
    }

    // Ensure current slide is valid
    const maxSlide = Math.max(
      0,
      this.filteredPhotos().length - this.itemsPerView
    );
    this.currentSlide = Math.min(this.currentSlide, maxSlide);
  }

  getSlideWidth(): string {
    return `${100 / this.itemsPerView}%`;
  }

  getPaginationDots(): number[] {
    const items = this.filteredPhotos();
    const dots = Math.max(1, items.length - this.itemsPerView + 1);
    return Array.from({ length: dots }, (_, i) => i);
  }

  getTabClasses(tab: 'photos' | 'videos'): string {
    const baseClasses =
      'px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center';
    if (this.activeTab === tab) {
      return `${baseClasses} bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg`;
    }
    return `${baseClasses} text-gray-600 hover:text-gray-900 hover:bg-white/50`;
  }

  getSortButtonClass(sortType: 'date' | 'name'): string {
    const baseClasses = 'px-4 py-2 rounded-lg font-medium transition-all duration-300';
    if (this.sortBy === sortType) {
      return `${baseClasses} bg-blue-100 text-blue-700 border border-blue-300`;
    }
    return `${baseClasses} bg-gray-100 text-gray-700 hover:bg-gray-200`;
  }

  getDotClasses(index: number): string {
    const baseClasses = 'w-3 h-3 rounded-full transition-all duration-300';
    if (index === this.currentSlide) {
      return `${baseClasses} bg-gradient-to-r from-blue-600 to-purple-600 scale-125`;
    }
    return `${baseClasses} bg-gray-300 hover:bg-gray-400`;
  }

  updateCarousel() {
    this.currentTranslate = -(this.currentSlide * (100 / this.itemsPerView));
  }

  nextSlide() {
    const items = this.filteredPhotos();
    const maxSlide = Math.max(0, items.length - this.itemsPerView);

    if (this.currentSlide < maxSlide) {
      this.currentSlide++;
      this.updateCarousel();
    } else {
      // Loop back to start
      this.currentSlide = 0;
      this.updateCarousel();
    }
  }

  prevSlide() {
    const items = this.filteredPhotos();
    const maxSlide = Math.max(0, items.length - this.itemsPerView);

    if (this.currentSlide > 0) {
      this.currentSlide--;
      this.updateCarousel();
    } else {
      // Loop to end
      this.currentSlide = maxSlide;
      this.updateCarousel();
    }
  }

  goToSlide(index: number) {
    this.currentSlide = index;
    this.updateCarousel();
  }

  openPreview(index: number) {
    this.currentPreviewIndex = index;
    this.showPreview = true;
    document.body.style.overflow = 'hidden';
  }

  closePreview() {
    this.showPreview = false;
    document.body.style.overflow = '';
  }

  modalNext() {
    const items = this.filteredPhotos();
    this.currentPreviewIndex = (this.currentPreviewIndex + 1) % items.length;
  }

  modalPrev() {
    const items = this.filteredPhotos();
    this.currentPreviewIndex =
      (this.currentPreviewIndex - 1 + items.length) % items.length;
  }

  // Touch swipe handlers
  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.touches[0].clientX;
    this.isSwiping = true;
  }

  onTouchMove(event: TouchEvent) {
    if (!this.isSwiping) return;
    this.touchEndX = event.touches[0].clientX;
  }

  onTouchEnd() {
    if (!this.isSwiping) return;

    const threshold = 50;
    const diff = this.touchStartX - this.touchEndX;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        this.nextSlide();
      } else {
        this.prevSlide();
      }
    }

    this.isSwiping = false;
    this.touchStartX = 0;
    this.touchEndX = 0;
  }

  // Image load handlers
  onImageLoad(src: string) {
    this.imageLoaded.add(src);
  }

  onImageError(event: Event, item?: MediaItem) {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
    
    // Create error placeholder
    const parent = img.parentElement;
    if (parent) {
      const placeholder = document.createElement('div');
      placeholder.className = 'absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center';
      placeholder.innerHTML = `
        <div class="text-center">
          <div class="text-4xl mb-2">📷</div>
          <p class="text-sm text-gray-500">Image not available</p>
          ${item ? `<p class="text-xs text-gray-400 mt-1">${item.original_name}</p>` : ''}
        </div>
      `;
      parent.appendChild(placeholder);
    }
  }

  // Helper methods
  formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid date';
    }
  }

  getPhotoTitle(item: MediaItem): string {
    if (item.title) return item.title;
    if (item.original_name) {
      // Remove file extension and clean up the name
      return item.original_name
        .replace(/\.(jpg|jpeg|png|gif)$/i, '')
        .replace(/[-_]/g, ' ')
        .replace(/WhatsApp Image /g, '')
        .trim();
    }
    return `UAC Photo ${item.id}`;
  }

  getPhotoDescription(item: MediaItem): string {
    if (item.description) return item.description;
    return 'Student success moment captured at Unstoppable Academic Classes';
  }

  getFileType(filename: string): string {
    const ext = filename.split('.').pop()?.toUpperCase();
    return ext || 'IMAGE';
  }

  getImageSize(item: MediaItem): string {
    // This is a placeholder - in a real app you'd get the actual image size
    const sizes = ['Small', 'Medium', 'Large'];
    const index = Math.floor(Math.random() * sizes.length);
    return sizes[index];
  }

  downloadCurrentPhoto() {
    const item = this.currentPhoto();
    if (item) {
      const link = document.createElement('a');
      link.href = item.src;
      link.download = item.original_name || `uac-photo-${item.id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  downloadAllPhotos() {
    // In a real app, this would trigger a bulk download or zip file
    alert(`Downloading all ${this.filteredPhotos().length} photos...\n\nThis feature would create a ZIP file with all images in a real implementation.`);
  }

  shareGallery() {
    if (navigator.share) {
      navigator.share({
        title: 'UAC Results Gallery',
        text: 'Check out these amazing success stories from Unstoppable Academic Classes!',
        url: window.location.href,
      });
    } else {
      // Fallback: Copy URL to clipboard
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert('Gallery link copied to clipboard!');
      });
    }
  }
}