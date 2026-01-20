import { Component, HostListener, OnInit, OnDestroy } from "@angular/core";
import { RouterLink, RouterLinkActive, RouterModule, NavigationEnd, Router } from "@angular/router";
import { CommonModule } from '@angular/common';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { 
  trigger, 
  transition, 
  style, 
  animate, 
  query, 
  stagger, 
  keyframes,
  state 
} from '@angular/animations';

interface Breadcrumb {
  label: string;
  url: string;
  isActive: boolean;
}

interface NavItem {
  id: string;
  route: string;
  label: string;
}

@Component({
  selector: "app-header",
  standalone: true,
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
  imports: [RouterLink, RouterLinkActive, RouterModule, CommonModule],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ height: '0', opacity: 0 }),
        animate('300ms ease-out', 
          style({ height: '*', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('250ms ease-in', 
          style({ height: '0', opacity: 0 }))
      ])
    ]),
    trigger('breadcrumbAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(-10px)' }),
          stagger('50ms', [
            animate('300ms ease-out', 
              keyframes([
                style({ opacity: 0, transform: 'translateY(-10px)', offset: 0 }),
                style({ opacity: 0.5, transform: 'translateY(5px)', offset: 0.3 }),
                style({ opacity: 1, transform: 'translateY(0)', offset: 1 })
              ])
            )
          ])
        ], { optional: true })
      ])
    ]),
    trigger('breadcrumbItem', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.8)' }),
        animate('400ms {{delay}} cubic-bezier(0.175, 0.885, 0.32, 1.275)', 
          style({ opacity: 1, transform: 'scale(1)' }))
      ], { params: { delay: '0ms' } })
    ])
  ]
})
export class HeaderComponent implements OnInit, OnDestroy {
  isScrolled = false;
  isMenuOpen = false;
  breadcrumbs: Breadcrumb[] = [];
  currentYear = new Date().getFullYear();
  
  navItems: NavItem[] = [
    { id: 'home-link', route: '/', label: 'Home' },
    { id: 'notes-link', route: '/notes', label: 'NOTES' },
    { id: 'gallery-link', route: '/gallery', label: 'Gallery' },
    { id: 'result-link', route: '/result', label: 'Result' },
    { id: 'contact-link', route: '/contact', label: 'Contact' },
    { id: 'mock-test', route: '/mock-test', label: 'Mock Test' }, 
    { id: 'mind-game', route: '/mind-game', label: 'UAC Games' },
    { id: 'career', route: '/career', label: 'Career' }
  ];
  
  private destroy$ = new Subject<void>();

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.updateBreadcrumbs();
      this.closeMobileMenu();
    });
  }

  ngOnInit() {
    this.updateBreadcrumbs();
    // Initial animation delay
    setTimeout(() => {
      this.isScrolled = window.scrollY > 10;
    }, 100);
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 10;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateBreadcrumbs() {
    const url = this.router.url;
    const segments = url.split('/').filter(segment => segment);
    
    if (segments.length === 0) {
      this.breadcrumbs = [{ label: '', url: '/', isActive: true }];
      return;
    }

    const breadcrumbs: Breadcrumb[] = [];

    let currentUrl = '';
    segments.forEach((segment, index) => {
      currentUrl += `/${segment}`;
      const isLast = index === segments.length - 1;
      const label = this.formatBreadcrumbLabel(segment);
      breadcrumbs.push({
        label,
        url: currentUrl,
        isActive: isLast
      });
    });

    this.breadcrumbs = breadcrumbs;
  }

  private formatBreadcrumbLabel(segment: string): string {
    return segment
      .replace(/-/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase());
  }

  isActive(route: string): boolean {
    return this.router.url === route || 
           (route !== '/' && this.router.url.startsWith(route));
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    if (this.isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  closeMobileMenu() {
    this.isMenuOpen = false;
    document.body.style.overflow = '';
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}