import { Component, OnInit, ViewEncapsulation, HostListener, ElementRef, ViewChild, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from "../headers/header/header.component";
import { FooterComponent } from "../footer/footer.component";

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  authorRole: string;
  date: string;
  readTime: string;
  imageUrl: string;
  featured: boolean;
  tags: string[];
}

interface CategoryInfo {
  id: string;
  name: string;
  icon: string;
  description: string;
  stats: string[];
  quickTips: string[];
  featuredContent: string;
}

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent],
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BlogComponent implements OnInit, AfterViewInit {
  // Enhanced Categories with Information
  categories: CategoryInfo[] = [
    {
      id: 'all',
      name: 'All Topics',
      icon: '📚',
      description: 'Complete collection of study resources, strategies, and insights for all competitive exams',
      stats: ['500+ Articles', '50 Expert Authors', '1M+ Monthly Readers'],
      quickTips: [
        'Mix different study techniques for better retention',
        'Follow a consistent daily schedule',
        'Join study groups for collaborative learning'
      ],
      featuredContent: 'Master the art of smart studying with our comprehensive guides'
    },
    {
      id: 'strategy',
      name: 'Exam Strategy',
      icon: '🎯',
      description: 'Proven techniques for UPSC, NEET, JEE, SSC, and other competitive exams',
      stats: ['98% Success Rate', '1000+ Topper Strategies', 'Personalized Plans'],
      quickTips: [
        'Analyze previous year papers pattern',
        'Allocate time based on weightage',
        'Practice with simulated test environments'
      ],
      featuredContent: 'Learn time-tested strategies from AIR 1 rankers'
    },
    {
      id: 'study',
      name: 'Study Tips',
      icon: '🧠',
      description: 'Cognitive techniques, memory hacks, and productivity methods for effective learning',
      stats: ['70% Better Retention', '3x Faster Learning', 'Scientific Methods'],
      quickTips: [
        'Use spaced repetition for long-term memory',
        'Teach concepts to reinforce learning',
        'Take strategic breaks (Pomodoro technique)'
      ],
      featuredContent: 'Discover neuroscience-backed study methods'
    },
    {
      id: 'motivation',
      name: 'Motivation',
      icon: '⚡',
      description: 'Success stories, mindset training, and psychological techniques to stay focused',
      stats: ['85% Consistency Boost', '500+ Success Stories', 'Mindset Coaching'],
      quickTips: [
        'Visualize your success daily',
        'Create a vision board of goals',
        'Celebrate small milestones'
      ],
      featuredContent: 'Stories of students who overcame challenges'
    },
    {
      id: 'current',
      name: 'Current Affairs',
      icon: '📰',
      description: 'Daily news analysis, editorial summaries, and GK updates for competitive exams',
      stats: ['Daily Updates', 'Exam-Relevant Content', 'Expert Analysis'],
      quickTips: [
        'Read one newspaper editorial daily',
        'Make monthly current affairs notes',
        'Connect events with static syllabus'
      ],
      featuredContent: 'Compilation of last 6 months important events'
    },
    {
      id: 'technology',
      name: 'Technology in Education',
      icon: '💻',
      description: 'AI tools, apps, and digital resources to enhance your learning experience',
      stats: ['50+ AI Tools', 'Digital Resources', 'Smart Study Platforms'],
      quickTips: [
        'Use AI for personalized learning paths',
        'Digital flashcards for quick revision',
        'Online mock test platforms'
      ],
      featuredContent: 'Top 10 AI tools for competitive exam preparation'
    }
  ];

  // Recent Posts
  recentPosts = [
    { title: 'How to Manage Time During UPSC Prelims', date: 'Mar 15, 2024', category: 'strategy' },
    { title: 'NEET 2024: Last 30 Days Strategy', date: 'Mar 10, 2024', category: 'strategy' },
    { title: 'The Psychology of Successful Students', date: 'Mar 5, 2024', category: 'motivation' },
    { title: 'AI Tools for Competitive Exam Preparation', date: 'Feb 28, 2024', category: 'technology' }
  ];

  // Popular Tags
  popularTags = [
    'UPSC', 'NEET', 'JEE', 'Time Management', 'Memory Techniques',
    'Mock Tests', 'Current Affairs', 'Study Plan', 'Revision Strategy'
  ];

  // Exam Statistics
  examStats = {
    upsc: { attempts: '1M+', success: '0.1%', preparation: '12-18 months' },
    neet: { attempts: '2M+', success: '15%', preparation: '18-24 months' },
    jee: { attempts: '1.2M+', success: '2%', preparation: '24+ months' },
    ssc: { attempts: '3M+', success: '0.5%', preparation: '6-12 months' }
  };

  // Blog Posts Data - Enhanced with more content
  blogPosts: BlogPost[] = [
    {
      id: 1,
      title: 'The Ultimate Time Management Strategy for UPSC Aspirants',
      excerpt: 'Learn how to allocate your study hours effectively across GS, Optional, and Essay papers with our proven time-blocking technique.',
      content: 'Full content here...',
      category: 'strategy',
      author: 'Dr. Rajesh Kumar',
      authorRole: 'UPSC Mentor, AIR 25',
      date: 'March 15, 2024',
      readTime: '8 min read',
      imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      featured: true,
      tags: ['UPSC', 'Time Management', 'Strategy', 'Productivity']
    },
    {
      id: 2,
      title: 'Memory Palace Technique: Remember More in Less Time',
      excerpt: 'Ancient memorization techniques adapted for modern competitive exams like NEET and JEE.',
      content: 'Full content here...',
      category: 'study',
      author: 'Prof. Anjali Sharma',
      authorRole: 'Memory Expert, Neuroscience Researcher',
      date: 'March 12, 2024',
      readTime: '6 min read',
      imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      featured: false,
      tags: ['Memory', 'NEET', 'Study Techniques', 'Cognitive Science']
    },
    {
      id: 3,
      title: 'Staying Motivated During Long Preparation Journeys',
      excerpt: 'Practical tips from UAC toppers on maintaining motivation through the ups and downs of exam preparation.',
      content: 'Full content here...',
      category: 'motivation',
      author: 'Rohan Verma',
      authorRole: 'IAS Topper 2023, AIR 7',
      date: 'March 10, 2024',
      readTime: '5 min read',
      imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      featured: false,
      tags: ['Motivation', 'Success Stories', 'Mindset', 'IAS']
    },
    {
      id: 4,
      title: 'AI Tools Every Student Should Use in 2024',
      excerpt: 'Discover how artificial intelligence can enhance your study efficiency and personalized learning.',
      content: 'Full content here...',
      category: 'technology',
      author: 'Tech Team UAC',
      authorRole: 'EdTech Specialists',
      date: 'March 8, 2024',
      readTime: '7 min read',
      imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      featured: false,
      tags: ['AI', 'Technology', 'Study Tools', 'Digital Learning']
    },
    {
      id: 5,
      title: 'Weekly Current Affairs Digest: March 2024',
      excerpt: 'Important national and international events relevant for UPSC, SSC, and other government exams.',
      content: 'Full content here...',
      category: 'current',
      author: 'Editorial Team',
      authorRole: 'Current Affairs Experts',
      date: 'March 5, 2024',
      readTime: '10 min read',
      imageUrl: 'https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      featured: false,
      tags: ['Current Affairs', 'UPSC', 'GK', 'Politics', 'Economy']
    },
    {
      id: 6,
      title: 'The Pomodoro Technique for Maximum Focus',
      excerpt: 'How to use timed study sessions to overcome procrastination and maintain concentration.',
      content: 'Full content here...',
      category: 'study',
      author: 'Dr. Priya Nair',
      authorRole: 'Psychology Expert, IIT Delhi',
      date: 'March 3, 2024',
      readTime: '4 min read',
      imageUrl: 'https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      featured: false,
      tags: ['Focus', 'Productivity', 'Study Techniques', 'Psychology']
    },
    {
      id: 7,
      title: 'How to Analyze Previous Years Question Papers',
      excerpt: 'A systematic approach to extract maximum benefit from past papers for any competitive exam.',
      content: 'Full content here...',
      category: 'strategy',
      author: 'Prof. Sanjay Mehta',
      authorRole: 'Exam Strategy Expert, 20+ Years Experience',
      date: 'March 1, 2024',
      readTime: '9 min read',
      imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      featured: false,
      tags: ['Question Papers', 'Analysis', 'Strategy', 'Exam Pattern']
    },
    {
      id: 8,
      title: 'Nutrition for Brain Power During Exams',
      excerpt: 'Foods and supplements that can enhance memory, focus, and cognitive function during preparation.',
      content: 'Full content here...',
      category: 'study',
      author: 'Dr. Neha Gupta',
      authorRole: 'Nutrition Specialist, AIIMS',
      date: 'Feb 28, 2024',
      readTime: '6 min read',
      imageUrl: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      featured: false,
      tags: ['Nutrition', 'Health', 'Brain Power', 'Wellness']
    },
    {
      id: 9,
      title: 'Digital Detox for Better Concentration',
      excerpt: 'Learn how to minimize digital distractions and create a focused study environment.',
      content: 'Full content here...',
      category: 'study',
      author: 'Mindfulness Team',
      authorRole: 'Digital Wellness Experts',
      date: 'Feb 25, 2024',
      readTime: '5 min read',
      imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      featured: false,
      tags: ['Focus', 'Digital Detox', 'Concentration', 'Mindfulness']
    },
    {
      id: 10,
      title: 'Budget 2024 Analysis for Competitive Exams',
      excerpt: 'Detailed analysis of Union Budget 2024 relevant for UPSC, SSC, and banking exams.',
      content: 'Full content here...',
      category: 'current',
      author: 'Economic Analysis Team',
      authorRole: 'Economics Experts',
      date: 'Feb 22, 2024',
      readTime: '12 min read',
      imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      featured: false,
      tags: ['Budget', 'Economy', 'UPSC', 'Current Affairs']
    }
  ];

  // State variables
  selectedCategory: string = 'all';
  filteredPosts: BlogPost[] = [];
  searchQuery: string = '';
  newsletterEmail: string = '';
  isSticky: boolean = false;
  currentPage: number = 1;
  itemsPerPage: number = 6;
  totalPages: number = 1;
  isLoading: boolean = false;
  showCategoryInfo: boolean = true;

  @ViewChild('categoriesBar') categoriesBar!: ElementRef;
  @ViewChild('featuredSection') featuredSection!: ElementRef;

  constructor(@Inject(PLATFORM_ID) private platformId: any) {}

  ngOnInit() {
    this.filteredPosts = this.blogPosts;
    this.calculatePages();
  }

  ngAfterViewInit() {
    this.setupScrollListener();
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: Event) {
    if (this.categoriesBar) {
      const offset = window.pageYOffset || document.documentElement.scrollTop;
      this.isSticky = offset > 100;
    }
  }
  

  setupScrollListener() {
    if (!isPlatformBrowser(this.platformId)) return;
    
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).style.setProperty('--animation-order', index.toString());
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.blog-card, .featured-card, .cta-section, .category-info-card').forEach(el => {
      observer.observe(el);
    });
  }

  // Category Information Methods
  getCurrentCategoryInfo(): CategoryInfo {
    return this.categories.find(cat => cat.id === this.selectedCategory) || this.categories[0];
  }

  getExamSuccessRate(exam: string): string {
    const rates: {[key: string]: string} = {
      'UPSC': '0.1%',
      'NEET': '15%',
      'JEE': '2%',
      'SSC': '0.5%'
    };
    return rates[exam] || 'N/A';
  }

  getStudyTechniques(category: string): string[] {
    const techniques: {[key: string]: string[]} = {
      'strategy': ['Reverse Engineering Papers', 'Time Allocation Matrix', 'Weakness Analysis'],
      'study': ['Active Recall', 'Spaced Repetition', 'Interleaved Practice'],
      'motivation': ['Vision Board Creation', 'Accountability Partner', 'Reward System'],
      'current': ['News Mapping', 'Editorial Analysis', 'Monthly Compilation'],
      'technology': ['AI Quiz Generation', 'Digital Flashcards', 'Progress Tracking Apps']
    };
    return techniques[category] || ['Customized Study Plan', 'Regular Revision', 'Mock Test Analysis'];
  }

  scrollToFeatured() {
    if (!isPlatformBrowser(this.platformId)) return;
    
    const featuredElement = document.querySelector('.featured-card');
    if (featuredElement) {
      featuredElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  }

  filterByCategory(categoryId: string) {
    this.selectedCategory = categoryId;
    this.currentPage = 1;
    this.showCategoryInfo = true;
    
    if (categoryId === 'all') {
      this.filteredPosts = this.blogPosts;
    } else {
      this.filteredPosts = this.blogPosts.filter(post => 
        post.category === categoryId
      );
    }
    
    this.calculatePages();
    
    // Smooth scroll to category info
    setTimeout(() => {
      if (isPlatformBrowser(this.platformId)) {
        const categoryInfo = document.querySelector('.category-info-section');
        if (categoryInfo) {
          categoryInfo.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }, 100);
  }

  searchPosts() {
    if (!this.searchQuery.trim()) {
      this.filteredPosts = this.blogPosts;
    } else {
      const query = this.searchQuery.toLowerCase();
      this.filteredPosts = this.blogPosts.filter(post =>
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    this.calculatePages();
  }

  calculatePages() {
    this.totalPages = Math.ceil(this.filteredPosts.length / this.itemsPerPage);
  }

  getPaginatedPosts() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredPosts.slice(startIndex, endIndex);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      
      if (isPlatformBrowser(this.platformId)) {
        const blogSection = document.querySelector('.blog-grid-section');
        if (blogSection) {
          blogSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }
  }

  submitNewsletter() {
    if (this.newsletterEmail && this.validateEmail(this.newsletterEmail)) {
      console.log(`Newsletter subscription: ${this.newsletterEmail}`);
      alert(`Thank you for subscribing with ${this.newsletterEmail}! You'll receive our weekly study tips.`);
      this.newsletterEmail = '';
    } else {
      alert('Please enter a valid email address.');
    }
  }

  validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  getFeaturedPost(): BlogPost | undefined {
    return this.blogPosts.find(post => post.featured);
  }

  getPageNumbers(): number[] {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  // Helper methods
  formatCategory(category: string): string {
    return category.charAt(0).toUpperCase() + category.slice(1);
  }

  getCategoryColor(category: string): string {
    const colors: {[key: string]: string} = {
      'strategy': 'from-blue-500 to-blue-600',
      'study': 'from-green-500 to-emerald-600',
      'motivation': 'from-purple-500 to-pink-600',
      'current': 'from-orange-500 to-red-600',
      'technology': 'from-indigo-500 to-purple-600',
      'all': 'from-gray-500 to-gray-700'
    };
    return colors[category] || 'from-blue-500 to-purple-600';
  }

  trackByPostId(index: number, post: BlogPost): number {
    return post.id;
  }

  trackByCategoryId(index: number, category: CategoryInfo): string {
    return category.id;
  }

  getCategoryIcon(categoryId: string): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category?.icon || '📚';
  }
}