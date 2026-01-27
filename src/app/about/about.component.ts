import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { FooterComponent } from "../footer/footer.component";
import { HeaderComponent } from '../headers/header/header.component';
import { Router, RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-about',
  imports: [CommonModule, HeaderComponent, FooterComponent, RouterLink, RouterModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {
  features = [
    {
      id: 1,
      title: 'Proven Results',
      description: 'Consistent 95%+ success rate with students achieving top ranks in competitive exams.',
      icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
    },
    {
      id: 2,
      title: 'Flexible Learning',
      description: 'Choose from online, offline, or hybrid learning modes that fit your schedule.',
      icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4'
    },
    {
      id: 3,
      title: 'Study Material',
      description: 'Comprehensive, regularly updated study materials and practice tests.',
      icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
    },
    {
      id: 4,
      title: 'Regular Tests',
      description: 'Weekly assessments and mock tests with detailed performance analysis.',
      icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
    },
    {
      id: 5,
      title: 'Doubt Support',
      description: '24/7 doubt resolution through dedicated mentors and online platforms.',
      icon: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z'
    },
    {
      id: 6,
      title: 'Career Guidance',
      description: 'Expert counseling for career paths and college admissions.',
      icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
    }
  ];

  // Stats Data
  stats = [
    { id: 1, label: 'Students Enrolled', value: 5000, currentValue: 0 },
    { id: 2, label: 'Courses Offered', value: 50, currentValue: 0 },
    { id: 3, label: 'Success Rate', value: 98, currentValue: 0, isPercentage: true },
    { id: 4, label: 'Years Experience', value: 10, currentValue: 0 }
  ];

  // Founder Data
  founder = {
    name: 'Sonu Srivastava',
    position: 'Founder & CEO',
    description: 'Coming from a background full of challenges and struggles, Sonu Srivastava turned hard work, discipline, and self-belief into success. A consistent academic topper, he dedicated years to mastering education and mentoring students. With over 10+ years of hands-on experience, he founded UAC with a clear vision—to guide students who come from humble beginnings and help them achieve excellence through the right direction, strategy, and relentless effort.',
    qualifications: [
      'Academic Topper',
      '10+ Years Teaching & Mentorship Experience',
      'Mentored Thousands of Successful Students'
    ]
  };
  

  // Animation State
  private observer!: IntersectionObserver;
  private animatedElements: Element[] = [];
  private isCounting = false;
  private animationCounters: { [key: number]: { startValue: number, targetValue: number, duration: number, startTime: number, isPercentage: boolean } } = {};

  constructor(private router:Router) {}

  ngOnInit(): void {
    // Initial page load animation
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease';
    
    setTimeout(() => {
      document.body.style.opacity = '1';
    }, 100);

    // Setup scroll animations
    this.setupScrollAnimations();
  }

  ngAfterViewInit(): void {
    // Initial check for elements in view
    setTimeout(() => this.checkInitialVisibility(), 100);
  }

  private setupScrollAnimations(): void {
    // Create intersection observer for scroll animations
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          
          // Start counter animation for stats
          if (entry.target.classList.contains('stat-item') && !this.isCounting) {
            this.isCounting = true;
            this.startCounterAnimations();
          }
          
          this.observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    });
  }

  private checkInitialVisibility(): void {
    // Collect all elements with animation classes
    this.animatedElements = Array.from(document.querySelectorAll('.fade-up, .slide-left, .slide-right, .fade-in, .stat-item'));
    
    // Observe each element
    this.animatedElements.forEach(element => {
      this.observer.observe(element);
      
      // Check if already visible
      const rect = element.getBoundingClientRect();
      const isVisible = (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
        rect.bottom >= 0
      );
      
      if (isVisible) {
        element.classList.add('visible');
        this.observer.unobserve(element);
      }
    });
  }

  private startCounterAnimations(): void {
    this.stats.forEach((stat, index) => {
      this.animationCounters[stat.id] = {
        startValue: 0,
        targetValue: stat.value,
        duration: 2000,
        startTime: Date.now(),
        isPercentage: stat.isPercentage || false
      };
      
      this.animateCounter(stat.id);
    });
  }

  private animateCounter(statId: number): void {
    const counter = this.animationCounters[statId];
    if (!counter) return;

    const update = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - counter.startTime;
      const progress = Math.min(elapsed / counter.duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      
      let value: number;
      if (counter.isPercentage) {
        value = parseFloat((easeOutQuart * counter.targetValue).toFixed(1));
      } else {
        value = Math.floor(easeOutQuart * counter.targetValue);
      }
      
      // Update the stat value
      const statIndex = this.stats.findIndex(s => s.id === statId);
      if (statIndex !== -1) {
        this.stats[statIndex].currentValue = value;
      }
      
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        // Ensure final value is set
        this.stats.find(s => s.id === statId)!.currentValue = counter.targetValue;
      }
    };
    
    requestAnimationFrame(update);
  }

  @HostListener('window:scroll')
onWindowScroll(): void {
  const scrollY = window.pageYOffset;
  const shapes = document.querySelectorAll('.shape');

  shapes.forEach((shape, index) => {
    const speed = 0.5 + index * 0.1;
    (shape as HTMLElement).style.transform =
      `translateY(${scrollY * speed * 0.1}px)`;
  });
}


  // Button click handlers
  enrollNow(): void {
    // Button click animation
    const button = document.getElementById('enrollBtn');
    if (button) {
      button.style.transform = 'scale(0.95)';
      this.router.navigate(['/contact'])
      setTimeout(() => {
        button.style.transform = '';
      }, 150);
    }
    // Show notification
    this.showNotification('Redirecting to Contact page...');
    
    // Navigate after delay
  }

  contactAdmissions(): void {
  this.router.navigate(['/mock-test'])
  }

  private showNotification(message: string): void {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full opacity-0 transition-all duration-300';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.classList.remove('translate-x-full', 'opacity-0');
      notification.classList.add('translate-x-0', 'opacity-100');
    }, 10);
    
    // Remove after delay
    setTimeout(() => {
      notification.classList.remove('translate-x-0', 'opacity-100');
      notification.classList.add('translate-x-full', 'opacity-0');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }

  // Utility methods
  getAnimationDelay(index: number): string {
    return `${(index * 100) + 100}ms`;
  }

  trackByFn(index: number, item: any): number {
    return item.id || index;
  }

  getStatDisplay(stat: any): string {
    if (stat.isPercentage) {
      return stat.currentValue.toFixed(stat.currentValue % 1 === 0 ? 0 : 1) + '%';
    }
    return Math.floor(stat.currentValue).toString();
  }
}
