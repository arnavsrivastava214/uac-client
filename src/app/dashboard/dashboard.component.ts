import { CommonModule, NgClass } from '@angular/common';
import { Component, type OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ReviewComponent } from '../reviews/review/review.component';
import { HeaderComponent } from '../headers/header/header.component';
import { ReviewCarouselComponent } from "../carousel/review-carousel/review-carousel.component";

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
@Component({
  selector: 'app-dashboard',
  imports: [FormsModule, ReactiveFormsModule, CommonModule, NgClass, ReviewComponent, HeaderComponent, RouterLink, ReviewCarouselComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  title = 'unstoppableAcademicClassess';


  isGameVisible = false;
  gameMessage: string = '';
  gameWinner: boolean = false;
  prizeCardIndex: number = 0;
  showAllCards: boolean = false;
  gameDisabled: boolean = false;
  isMenuOpen = false
  contactForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ["", [Validators.required, Validators.minLength(2)]],
      email: ["", [Validators.required, Validators.email]],
      message: ["", [Validators.required, Validators.minLength(10)]],
    })
  }

  services: Service[] = [
    {
      icon: "fas fa-bullseye",
      title: "Life Coaching",
      description:
        "Transform your personal and professional life with personalized guidance and actionable strategies.",
      color: "from-blue-500 to-purple-600",
    },
    {
      icon: "fas fa-briefcase",
      title: "Career Coaching",
      description: "Accelerate your career growth and achieve your professional goals with expert mentorship.",
      color: "from-green-500 to-teal-600",
    },
    {
      icon: "fas fa-heart",
      title: "Wellness Coaching",
      description: "Develop healthy habits and achieve optimal well-being through holistic lifestyle changes.",
      color: "from-pink-500 to-rose-600",
    },
    {
      icon: "fas fa-users",
      title: "Team Coaching",
      description: "Build high-performing teams and enhance collaboration in your organization.",
      color: "from-orange-500 to-red-600",
    },
  ]

  stats: any = [
    { number: "500+", label: "Clients Transformed" },
    { number: "10+", label: "Years Experience" },
    { number: "95%", label: "Success Rate" },
    { number: "10:00 AM to 8:00 PM", label: "Support Available" },
  ]

  testimonials: Testimonial[] = [
    {
      name: "Sarah Johnson",
      position: "Marketing Director",
      image: "/placeholder.svg?height=60&width=60",
      content:
        "The coaching program completely transformed my approach to leadership. I've seen incredible growth in both my career and personal life.",
      rating: 5,
    },
    {
      name: "Michael Chen",
      position: "Entrepreneur",
      image: "/placeholder.svg?height=60&width=60",
      content:
        "Working with this coach helped me overcome limiting beliefs and achieve goals I never thought possible. Highly recommended!",
      rating: 5,
    },
    {
      name: "Emily Rodriguez",
      position: "Team Lead",
      image: "/placeholder.svg?height=60&width=60",
      content:
        "The personalized approach and actionable strategies made all the difference. I'm now leading my team with confidence and clarity.",
      rating: 5,
    },
  ]
  ngOnInit() {
    scroll(0, 0)
  }
 


  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    this.isMenuOpen = false
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      console.log("Form submitted:", this.contactForm.value)
      alert("Message sent successfully!")
      this.contactForm.reset()
    } else {
      console.log("Form is invalid")
    }
  }

  getStarArray(rating: number): number[] {
    return Array(rating).fill(0)
  }

  get name() {
    return this.contactForm.get("name")
  }
  get email() {
    return this.contactForm.get("email")
  }
  get message() {
    return this.contactForm.get("message")
  }

  startGame() {
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
      this.gameMessage = 'You found the prize! You won!';
      this.runConfettiAnimation();
    } else {
      this.gameWinner = false;
      this.gameMessage = 'Better luck next time!';
      setTimeout(() => {
        this.closeGame();
      }, 2000); 
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
  
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = `${Math.random() * 100}%`;
      confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
      confettiContainer.appendChild(confetti);
    }
    
    setTimeout(() => {
      confettiContainer.innerHTML = '';
    }, 4000);
  }
}
