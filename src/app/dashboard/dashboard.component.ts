import { CommonModule, NgClass } from '@angular/common';
import { ApplicationRef, Component, HostListener, NgZone, type OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ReviewComponent } from '../reviews/review/review.component';
import { HeaderComponent } from '../headers/header/header.component';
import { ReviewCarouselComponent } from "../carousel/review-carousel/review-carousel.component";
import { ApplicationServiceService } from '../services/application-service.service';
import { AlertService } from '../services/alert.service';
import { Subject } from 'rxjs';
import { FooterComponent } from "../footer/footer.component";

interface Stat {
  number: any
  label: string
}

interface Service {
  icon: string
  title: string
  description: string
  color: string
}

interface Testimonial {
  name: string
  position: string
  image: string
  content: string
  rating: number
}
interface Teacher {
  name: string;
  subject: string;
  experience: string;
  bio: string;
  image: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [FormsModule, ReactiveFormsModule, CommonModule, ReviewComponent, HeaderComponent, RouterLink, ReviewCarouselComponent, FooterComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  title = 'unstoppableAcademicClassess';

  isGameVisible = false;
  gameMessage: string = '';
  gameWinner: boolean = false;
  prizeCardIndex: number = 0;
  showAllCards: boolean = false;
  gameDisabled: boolean = false;
  isMenuOpen = false;
  contactForm: FormGroup;
  uacOfficialMail: string = 'unstoppableacademicclassess@gmail.com';
  copied: boolean = false;
  isReadMoreVisible: boolean = false;
  isTrophyVisible: boolean = true;
  hasPlayedGame: boolean = false;



  
  teachers: Teacher[] = [
    {
      name: "Sonu Srivastava (CEO & FOUNDER)",
      subject: "Science",
      experience: "9+",
      bio: "Expert in advanced Science  helping students master concepts easily.",
      image: "https://res.cloudinary.com/dmwn3mkzl/image/upload/f_auto,q_auto,w_400/v1772355678/uac-gallery/zprobm8lggd4rzrj1zk0.jpg"
    },
    {
      name: "Narayan Mishra",
      subject: "Maths",
      experience: "6+ Years",
      bio: "Passionate educator focusing on conceptual clarity.",
      image: "https://res.cloudinary.com/dmwn3mkzl/image/upload/f_auto,q_auto,w_400/v1772900085/uac-gallery/zteeemgepcmdbcfxsao3.jpg"
    },
    {
      name: "Yuvraj Srivastava",
      subject: "Maths",
      experience: "4+ Years",
      bio: "Specialist in Maths with excellent teaching methodology.",
      image: "https://res.cloudinary.com/dmwn3mkzl/image/upload/f_auto,q_auto,w_400/v1772900084/uac-gallery/jloqymxgp6hq2kn2acfq.jpg"
    },
    {
      name: "Prachi Tiwari",
      subject: "English",
      experience: "11+ Years",
      bio: "Helping students understand english with practical examples.",
      image: "https://res.cloudinary.com/dmwn3mkzl/image/upload/f_auto,q_auto,w_400/v1772900082/uac-gallery/w8tru843rjxmcdgrwias.jpg"
    }
  ];

  stats: any = [
    { number: "500+", label: "Clients Transformed" },
    { number: "10+", label: "Years Experience" },
    { number: "95%", label: "Success Rate" },
    { number: "10:00 AM to 8:00 PM", label: "Support Available" },
  ];

  testimonials: Testimonial[] = [
    {
      name: "Sarah Johnson",
      position: "Marketing Director",
      image: "/placeholder.svg?height=60&width=60",
      content: "The coaching program completely transformed my approach to leadership. I've seen incredible growth in both my career and personal life.",
      rating: 5,
    },
    {
      name: "Michael Chen",
      position: "Entrepreneur",
      image: "/placeholder.svg?height=60&width=60",
      content: "Working with this coach helped me overcome limiting beliefs and achieve goals I never thought possible. Highly recommended!",
      rating: 5,
    },
    {
      name: "Emily Rodriguez",
      position: "Team Lead",
      image: "/placeholder.svg?height=60&width=60",
      content: "The personalized approach and actionable strategies made all the difference. I'm now leading my team with confidence and clarity.",
      rating: 5,
    },
  ];

  scrollProgress: number = 0;
  showBackToTop: boolean = false;
  
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private service: ApplicationServiceService,
    private alert: AlertService,
    private appRef: ApplicationRef,
    private ngZone: NgZone
  ) {
    this.contactForm = this.fb.group({
      name: ["", [Validators.required, Validators.minLength(2)]],
      email: ["", [Validators.required, Validators.email]],
      subject: ["", [Validators.required]],
      message: ["", [Validators.required, Validators.minLength(10)]],
    });

  }

  ngOnInit() {
    scroll(0, 0);
    this.checkGameStatus();
    this.initScrollObserver();    // <-- new
    this.initIntersectionObserver(); // <-- new
  }

  // HostListener to track scroll
  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event) {
    const winScroll = document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  
    this.scrollProgress = (winScroll / height) * 100;
    this.showBackToTop = winScroll > 300;
  }

  @HostListener('mousemove', ['$event'])
onMouseMove(event: MouseEvent) {
  const circles = document.querySelectorAll('.parallax-circle');
  const x = event.clientX / window.innerWidth;
  const y = event.clientY / window.innerHeight;
  circles.forEach((circle: any, index) => {
    const speed = index + 1;
    const moveX = (x - 0.5) * speed * 20;
    const moveY = (y - 0.5) * speed * 20;
    circle.style.transform = `translate(${moveX}px, ${moveY}px)`;
  });
}

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Intersection Observer to add 'in-view' class to sections
  initIntersectionObserver() {
    const options = {
      threshold: 0.2,
      rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          // Optionally unobserve after first trigger
          observer.unobserve(entry.target);
        }
      });
    }, options);

    // Observe all sections you want to animate
    const sections = document.querySelectorAll('section, .stat-item, .service-card');
    sections.forEach(section => observer.observe(section));
  }

  // Optional: smoother initial load
  initScrollObserver() {
    // Already using HostListener
  }

  checkGameStatus(): void {
    const gameLost = sessionStorage.getItem('uac_game_lost');
    if (gameLost === 'true') {
      this.isTrophyVisible = false;
      this.hasPlayedGame = true;
    }
  }

  toggleReadMore(): void {
    this.isReadMoreVisible = !this.isReadMoreVisible;
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    this.isMenuOpen = false;
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      this.service.sendRequest(this.contactForm.value, (res: any) => {
        if (res.status == 200) {
          this.alert.success(res.message);
          this.contactForm.reset();
        } else {
          this.alert.error(res.message);
        }
      });
    } else {
      console.log("Form is invalid");
    }
  }

  getStarArray(rating: number): number[] {
    return Array(rating).fill(0);
  }

  get name() {
    return this.contactForm.get("name");
  }
  
  get email() {
    return this.contactForm.get("email");
  }
  
  get subject() {
    return this.contactForm.get("subject");
  }
  
  get message() {
    return this.contactForm.get("message");
  }

  startGame() {
    if (!this.isTrophyVisible) return;
    
    this.prizeCardIndex = Math.floor(Math.random() * 3);
    this.isGameVisible = true;
    this.gameWinner = false;
    this.gameMessage = '';
    this.showAllCards = false;
    this.gameDisabled = false;
  }

  selectCard(index: number) {
    if (this.gameDisabled) return;
    this.gameDisabled = true;
    this.showAllCards = true;

    if (index === this.prizeCardIndex) {
      this.gameWinner = true;
      this.gameMessage = '🎉 Congratulations! You found the prize!';
      this.runConfettiAnimation();
      
      setTimeout(() => {
        this.closeGame();
      }, 4000);
    } else {
      this.gameWinner = false;
      this.gameMessage = '😔 Better luck next time!';
      
      sessionStorage.setItem('uac_game_lost', 'true');
      this.isTrophyVisible = false;
      this.hasPlayedGame = true;
      
      setTimeout(() => {
        this.closeGame();
      }, 2500);
    }
  }

  closeGame() {
    this.isGameVisible = false;
    this.gameWinner = false;
    this.gameMessage = '';
    this.showAllCards = false;
    this.gameDisabled = false;

    const confettiContainer = document.getElementById('confetti-container');
    if (confettiContainer) {
      confettiContainer.innerHTML = '';
    }
  }

  runConfettiAnimation() {
    const confettiContainer = document.getElementById('confetti-container');
    if (!confettiContainer) return;

    for (let i = 0; i < 100; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = `${Math.random() * 100}%`;
      confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
      confetti.style.animationDelay = `${Math.random() * 0.5}s`;
      confettiContainer.appendChild(confetti);
    }

    setTimeout(() => {
      confettiContainer.innerHTML = '';
    }, 4000);
  }

  copyToClipboard(text: string): void {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      this.copied = true;
      setTimeout(() => {
        this.copied = false;
      }, 1500);
      console.log('Text copied to clipboard:', text);
    } catch (err) {
      console.error('Failed to copy text:', err);
      alert('Could not copy text. Please copy manually: ' + text);
    } finally {
      document.body.removeChild(textarea);
    }
  }

  callNumber(phoneNumber: string): void {
    window.location.href = `tel:${phoneNumber}`;
    console.log('Attempting to call:', phoneNumber);
  }
}