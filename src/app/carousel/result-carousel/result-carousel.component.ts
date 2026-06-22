// result-carousel.component.ts (updated with new features)
import { CommonModule, NgFor } from '@angular/common';
import { Component, OnInit, OnDestroy, ElementRef, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from "../../headers/header/header.component";
import { FooterComponent } from "../../footer/footer.component";

interface CarouselImage {
  src: string;
  alt: string;
}

interface VideoItem {
  url: string;
  thumbnail: string;
  title: string;
  studentName: string;
  exam: string;
  duration: string;
  aspect: 'landscape' | 'portrait';
}

interface StudentResult {
  name: string;
  rollNo: string;
  course: string;
  year: string;
  exam: string;
}

@Component({
  selector: 'app-result-carousel',
  imports: [FormsModule, CommonModule, NgFor, HeaderComponent, FooterComponent],
  templateUrl: './result-carousel.component.html',
  styleUrl: './result-carousel.component.scss'
})
export class ResultCarouselComponent implements OnInit, OnDestroy, AfterViewInit {
  // ========== EXISTING CAROUSEL DATA & LOGIC (UNCHANGED) ==========
  images: CarouselImage[] = [
    { src: 'https://unstoppableacademicclasses.weebly.com/uploads/1/2/7/3/127366569/p29.png', alt: 'Client A achieved 200% growth' },
    { src: 'https://unstoppableacademicclasses.weebly.com/uploads/1/2/7/3/127366569/p21.png', alt: 'Team B increased productivity by 30%' },
    { src: 'https://unstoppableacademicclasses.weebly.com/uploads/1/2/7/3/127366569/p59.jpeg', alt: 'Individual C landed their dream job' },
    { src: 'https://unstoppableacademicclasses.weebly.com/uploads/1/2/7/3/127366569/p61.png', alt: 'Startup D secured funding after coaching' },
    { src: 'https://unstoppableacademicclasses.weebly.com/uploads/1/2/7/3/127366569/p60.png', alt: 'Our workshop boosted morale and collaboration' }
  ];

  currentIndex: number = 0;
  isPrev: boolean = false;
  private intervalId: any;
  showPreview: boolean = false;
  previewImageUrl: string = '';
  previewImageIndex: number = 0;

  // ========== NEW FEATURES: SEARCH & FILTER ==========
  searchQuery: string = '';
  selectedFilter: string = 'all';
  filters = [
    { label: 'All', value: 'all' },
    { label: 'UP Police', value: 'uppolice' },
    { label: 'SSC', value: 'ssc' },
    { label: 'Railway', value: 'railway' },
    { label: 'Board', value: 'board' }
  ];
  
  allStudents: StudentResult[] = [
    { name: 'Rahul Sharma', rollNo: 'UAC101', course: 'UP Police Batch', year: '2025', exam: 'UP Police Constable' },
    { name: 'Priya Verma', rollNo: 'UAC102', course: 'SSC CGL', year: '2025', exam: 'SSC CGL' },
    { name: 'Amit Singh', rollNo: 'UAC103', course: 'Railway NTPC', year: '2025', exam: 'Railway NTPC' },
    { name: 'Neha Gupta', rollNo: 'UAC104', course: 'UP Board', year: '2025', exam: 'UP Board Exam' },
    { name: 'Suraj Yadav', rollNo: 'UAC105', course: 'UP Police', year: '2024', exam: 'UP Police SI' }
  ];
  filteredStudents: StudentResult[] = [];

  // ========== ANIMATED STATISTICS ==========
  animatedStats = { students: 0, successRate: 0, experience: 0, selections: 0 };
  private statsObserver: IntersectionObserver | null = null;
  private statsAnimated = false;

  // ========== VIDEO GALLERY (with aspect ratio handling) ==========
  videoGallery: VideoItem[] = [
    { url: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4', thumbnail: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=400', title: 'Success Story: UP Police Topper', studentName: 'Rahul Sharma', exam: 'UP Police', duration: '2:30', aspect: 'landscape' },
    { url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', thumbnail: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400', title: 'SSC CGL Journey', studentName: 'Priya Verma', exam: 'SSC', duration: '3:15', aspect: 'landscape' },
    // Portrait video simulation (using same but we force container to handle any ratio)
    { url: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4', thumbnail: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?w=400', title: 'Motivational Reel', studentName: 'Sonu Sir', exam: 'Mentorship', duration: '1:45', aspect: 'portrait' }
  ];
  
  showVideoModal: boolean = false;
  currentVideoUrl: string = '';
  currentVideoIndex: number = 0;
  @ViewChildren('videoPlayer') videoPlayers!: QueryList<ElementRef<HTMLVideoElement>>;

  // ========== LIFECYCLE ==========
  constructor() { }

  ngOnInit(): void {
    this.startAutoplay();
    this.filteredStudents = [...this.allStudents];
  }

  ngAfterViewInit(): void {
    this.setupStatsAnimation();
  }

  ngOnDestroy(): void {
    this.stopAutoplay();
    if (this.statsObserver) this.statsObserver.disconnect();
  }

  // ========== EXISTING CAROUSEL METHODS (unchanged) ==========
  startAutoplay(): void {
    this.intervalId = setInterval(() => this.nextImage(), 5000);
  }
  stopAutoplay(): void {
    if (this.intervalId) clearInterval(this.intervalId);
  }
  nextImage(): void {
    this.stopAutoplay();
    this.isPrev = false;
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this.startAutoplay();
  }
  prevImage(): void {
    this.stopAutoplay();
    this.isPrev = true;
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    this.startAutoplay();
  }
  goToImage(index: number): void {
    this.stopAutoplay();
    this.isPrev = index > this.currentIndex ? false : true;
    this.currentIndex = index;
    this.startAutoplay();
  }
  openPreview(index: number): void {
    this.stopAutoplay();
    this.previewImageIndex = index;
    this.previewImageUrl = this.images[index].src;
    this.showPreview = true;
    document.body.style.overflow = 'hidden';
  }
  closePreview(): void {
    this.showPreview = false;
    document.body.style.overflow = '';
    this.startAutoplay();
  }
  nextPreviewImage(): void {
    this.previewImageIndex = (this.previewImageIndex + 1) % this.images.length;
    this.previewImageUrl = this.images[this.previewImageIndex].src;
  }
  prevPreviewImage(): void {
    this.previewImageIndex = (this.previewImageIndex - 1 + this.images.length) % this.images.length;
    this.previewImageUrl = this.images[this.previewImageIndex].src;
  }

  // ========== SEARCH & FILTER LOGIC ==========
  filterResults(): void {
    let filtered = this.allStudents;
    if (this.selectedFilter !== 'all') {
      filtered = filtered.filter(s => s.exam.toLowerCase().includes(this.selectedFilter));
    }
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(s => s.name.toLowerCase().includes(query) || 
                                      s.rollNo.toLowerCase().includes(query) || 
                                      s.course.toLowerCase().includes(query) ||
                                      s.year.includes(query));
    }
    this.filteredStudents = filtered;
  }
  setFilter(filterValue: string): void {
    this.selectedFilter = filterValue;
    this.filterResults();
  }

  // ========== STATISTICS ANIMATION ==========
  private setupStatsAnimation(): void {
    const statSection = document.querySelector('.bg-gradient-to-r.from-purple-700');
    if (!statSection) return;
    this.statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.statsAnimated) {
          this.statsAnimated = true;
          this.animateCounter('students', 1250, 1200);
          this.animateCounter('successRate', 95, 95);
          this.animateCounter('experience', 5, 5);
          this.animateCounter('selections', 530, 500);
        }
      });
    }, { threshold: 0.3 });
    this.statsObserver.observe(statSection);
  }
  private animateCounter(prop: keyof typeof this.animatedStats, target: number, initial: number): void {
    let current = initial;
    const step = Math.ceil(target / 50);
    const interval = setInterval(() => {
      current += step;
      if (current >= target) {
        this.animatedStats[prop] = target;
        clearInterval(interval);
      } else {
        this.animatedStats[prop] = current;
      }
    }, 30);
  }

  // ========== VIDEO GALLERY MODAL (Fix for Portrait/Landscape) ==========
  openVideoModal(index: number): void {
    this.stopAutoplay();
    this.currentVideoIndex = index;
    this.currentVideoUrl = this.videoGallery[index].url;
    this.showVideoModal = true;
    document.body.style.overflow = 'hidden';
  }
  closeVideoModal(): void {
    this.showVideoModal = false;
    document.body.style.overflow = '';
    this.startAutoplay();
    // Pause video if playing
    if (this.videoPlayers && this.videoPlayers.length) {
      const video = this.videoPlayers.first?.nativeElement;
      if (video) video.pause();
    }
  }
  nextVideo(): void {
    this.currentVideoIndex = (this.currentVideoIndex + 1) % this.videoGallery.length;
    this.currentVideoUrl = this.videoGallery[this.currentVideoIndex].url;
  }
  prevVideo(): void {
    this.currentVideoIndex = (this.currentVideoIndex - 1 + this.videoGallery.length) % this.videoGallery.length;
    this.currentVideoUrl = this.videoGallery[this.currentVideoIndex].url;
  }

  // ========== DOWNLOAD & SHARE ==========
  downloadMeritList(): void {
    // Simulate PDF download
    window.open('https://unstoppableacademicclasses.weebly.com/uploads/1/2/7/3/127366569/merit_list_2026.pdf', '_blank');
  }
  shareOnWhatsApp(): void {
    const text = encodeURIComponent("🎉 UAC Results 2026 are out! 500+ students selected. Check out the success stories: https://uac-results.com");
    window.open(`https://wa.me/?text=${text}`, '_blank');
  }
}