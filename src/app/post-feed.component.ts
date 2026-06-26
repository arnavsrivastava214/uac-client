import { Component, OnInit, inject, signal, effect, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject, takeUntil, debounceTime } from 'rxjs';
import { PublicPost, AdminPostService } from './services/admin-post.service';
import { AuthService } from './services/auth.service';
import { PostCardComponent } from './post-card.component';
import { PostCommentsSheetComponent } from './post-comments-sheet.component';
import { LoginModalComponent } from './login-modal.component';
import { FooterComponent } from "./footer/footer.component";
import { HeaderComponent } from "./headers/header/header.component";

@Component({
  selector: 'app-post-feed',
  standalone: true,
  imports: [CommonModule, PostCardComponent, PostCommentsSheetComponent, LoginModalComponent, FooterComponent, HeaderComponent],
  template: `
    <!-- Main Container -->
<div class="min-h-screen bg-gradient-to-b from-gray-50 to-white">


<app-header
  (loginClicked)="showLoginModal()">
</app-header>
  <!-- <header class="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
    <div class="container mx-auto px-4 sm:px-6 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-md hover:shadow-lg transition-shadow duration-300">
            <span class="text-white font-bold text-2xl">C</span>
          </div>
          <div class="hidden sm:block">
            <h1 class="text-2xl font-bold text-gray-900 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">UAC Posts</h1>
            <p class="text-sm text-gray-600 mt-1">Learn, Grow, Succeed Together</p>
          </div>
          <div class="sm:hidden">
            <h1 class="text-xl font-bold text-gray-900">Coaching</h1>
            <p class="text-xs text-gray-600">Institute</p>
          </div>
        </div>
        
        Auth Section -->
        <!-- <div class="flex items-center gap-3">
          <div *ngIf="authService.isLoggedIn()" class="flex items-center gap-3">
            <div class="hidden sm:block text-right">
              <p class="font-semibold text-gray-900">{{ authService.getUser()?.name }}</p>
              <p class="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded-full inline-block">Student</p>
            </div>
            <button 
              (click)="authService.logout()"
              class="px-4 py-2.5 text-sm font-medium border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 hover:shadow-sm active:scale-95"
            >
              Logout
            </button>
          </div>
          <div *ngIf="!authService.isLoggedIn()">
            <button 
              (click)="showLoginModal()"
              class="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold shadow-md hover:shadow-lg active:scale-95"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  </header> --> 

  <!-- Main Content -->
  <main class="container mx-auto px-4 sm:px-6 py-8 md:py-12">
    <!-- Page Title -->
    <div class="mb-12 md:mb-16 text-center">
      <div class="inline-flex items-center gap-2 mb-4">
        <div class="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
          <svg class="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
          </svg>
        </div>
        <span class="text-sm font-semibold text-blue-600 uppercase tracking-wider">Community Feed</span>
      </div>
      <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
        Latest <span class="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Posts</span>
      </h2>
      <p class="text-gray-600 text-lg max-w-2xl mx-auto px-4">
        Stay updated with expert coaching tips, inspiring success stories, and valuable learning resources.
      </p>
    </div>

    <!-- Loading Skeleton -->
    <div *ngIf="isLoading() && posts().length === 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div *ngFor="let _ of [1,2,3,4,5,6]" class="animate-pulse">
        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div class="h-64 bg-gradient-to-r from-gray-100 to-gray-200"></div>
          <div class="p-6 space-y-4">
            <div class="h-7 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-3/4"></div>
            <div class="space-y-2">
              <div class="h-4 bg-gray-200 rounded"></div>
              <div class="h-4 bg-gray-200 rounded w-5/6"></div>
              <div class="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
            <div class="flex gap-4 pt-6 border-t border-gray-100">
              <div class="h-10 bg-gray-200 rounded-full w-24"></div>
              <div class="h-10 bg-gray-200 rounded-full w-28"></div>
              <div class="h-10 bg-gray-200 rounded-full w-24 ml-auto"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Posts Grid -->
    <div *ngIf="!isLoading() || posts().length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <app-post-card
        *ngFor="let post of posts()"
        [data]="post"
        (likeClicked)="handleLike($event)"
        (commentClicked)="handleComment($event)"
        (shareClicked)="handleShare($event)"
      ></app-post-card>
    </div>

    <!-- Load More -->
    <div *ngIf="hasMorePosts() && !isLoading()" class="mt-16 text-center">
      <button
        (click)="loadMore()"
        [disabled]="isLoadingMore()"
        class="group px-10 py-4 bg-white border-2 border-gray-300 text-gray-800 rounded-2xl hover:border-blue-500 hover:shadow-xl transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
      >
        <span *ngIf="isLoadingMore()" class="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent inline-block mr-3 align-middle"></span>
        {{ isLoadingMore() ? 'Loading More Posts...' : 'Load More Posts' }}
        <svg *ngIf="!isLoadingMore()" class="w-5 h-5 inline-block ml-2 group-hover:translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
        </svg>
      </button>
      <p class="text-gray-500 text-sm mt-4">Scroll down for more inspiring content</p>
    </div>

    <!-- End of Feed -->
    <div *ngIf="!hasMorePosts() && posts().length > 0" class="mt-20 text-center">
      <div class="inline-flex flex-col items-center gap-4">
        <div class="relative">
          <div class="w-16 h-16 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center">
            <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          <div class="absolute -inset-1 bg-blue-200/30 rounded-2xl blur-sm -z-10"></div>
        </div>
        <div class="space-y-2">
          <h3 class="text-xl font-bold text-gray-900">You've reached the end! 🎉</h3>
          <p class="text-gray-600 max-w-md mx-auto">
            You've seen all available posts. Check back later for new content or share your favorite posts with friends.
          </p>
        </div>
        <div class="flex items-center gap-4 mt-4">
          <div class="h-px w-20 bg-gradient-to-r from-transparent to-gray-300"></div>
          <span class="text-gray-400 text-sm font-medium">That's all for now</span>
          <div class="h-px w-20 bg-gradient-to-l from-transparent to-gray-300"></div>
        </div>
      </div>
    </div>
  </main>
  <app-footer></app-footer>

  <!-- Comments Bottom Sheet -->
  <app-post-comments-sheet
    *ngIf="activePostId()"
    [postId]="activePostId()!"
    [isOpen]="commentsSheetOpen()"
    (closed)="closeCommentsSheet()"
    (triggerAuth)="showLoginModalForAction('comment')"
  ></app-post-comments-sheet>




  <app-login-modal
  *ngIf="showLoginModalFlag()"
  (closed)="hideLoginModal()"
  (success)="onAuthSuccess()"
></app-login-modal>

  `,
  styles: [`
    :host {
      display: block;
    }
    
    .animate-pulse {
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: .5; }
    }
    
    .animate-spin {
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `]
})
export class PostFeedComponent implements OnInit, OnDestroy {
  private adminPostService = inject(AdminPostService);
  protected authService = inject(AuthService);
  private router = inject(Router);
  private destroy$ = new Subject<void>();

  // State signals
  posts = signal<PublicPost[]>([]);
  isLoading = signal(true);
  isLoadingMore = signal(false);
  hasMorePosts = signal(true);
  currentPage = signal(1);
  pageSize = 9;

  // UI State
  commentsSheetOpen = signal(false);
  activePostId = signal<string | null>(null);
  showLoginModalFlag = signal(false);
  pendingAction = signal<{
    type: 'like' | 'comment';
    postId?: number;
    callback?: () => void;
  } | null>(null);
  

  constructor() {
    // Effect to handle auth success and retry pending actions
    effect(() => {
      if (this.authService.isLoggedIn() && this.pendingAction()) {
        this.retryPendingAction();
      }
    });
  }

  ngOnInit(): void {
    this.loadPosts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadPosts(): void {
    this.isLoading.set(true);
    
    this.adminPostService.getPublicPosts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (posts) => {

            const mapped: PublicPost[] = posts.map(p => ({
              ...p,
              likeCount: p.likeCount ?? 0,
              isLikedByMe: p.isLikedByMe ?? false
            }));
          
            this.posts.set(mapped);
            this.hasMorePosts.set(mapped.length === this.pageSize);
            this.isLoading.set(false);
          }
          
      });
  }

  loadMore(): void {
    if (!this.hasMorePosts() || this.isLoadingMore()) return;

    this.isLoadingMore.set(true);
    this.currentPage.update(page => page + 1);

    // Simulate pagination - adjust based on your API
    this.adminPostService.getPublicPosts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (newPosts) => {

            const mapped: PublicPost[] = newPosts.map(p => ({
              ...p,
              likeCount: p.likeCount ?? 0,
              isLikedByMe: p.isLikedByMe ?? false
            }));
          
            this.posts.update(posts => [...posts, ...mapped]);
            this.hasMorePosts.set(mapped.length === this.pageSize);
            this.isLoadingMore.set(false);
          }
          
      });
  }

  handleLike(event: { postId: any; requireAuth: () => void }): void {
    if (!this.authService.isLoggedIn()) {
      this.pendingAction.set({
        type: 'like',
        postId: event.postId,
        callback: event.requireAuth
      });
      this.showLoginModalForAction('like');
      return;
    }

    this.performLike(event.postId);
  }

  private performLike(postId: any): void {
    this.adminPostService.likePost(postId)
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(300) // Prevent rapid clicks
      )
      .subscribe({
        next: (response) => {
          // Update the post with new like status
          this.posts.update(posts => 
            posts.map(post => 
              post.id == postId 
                ? { ...post, isLikedByMe: response.liked, likeCount: response.count }
                : post
            )
          );
        },
        error: (error) => {
          console.error('Failed to like post', error);
          // Revert optimistic update if needed
        }
      });
  }

  handleComment(event: { postId:any; requireAuth: () => void }): void {
    if (!this.authService.isLoggedIn()) {
      this.pendingAction.set({
        type: 'comment',
        postId: event.postId,
        callback: event.requireAuth
      });
      this.showLoginModalForAction('comment');
      return;
    }

    this.openCommentsSheet(event.postId);
  }

  handleShare(postId: any): void {
    console.log('Sharing post:', postId);
  }

  openCommentsSheet(postId: any): void {
    this.activePostId.set(postId);
    this.commentsSheetOpen.set(true);
  }

  closeCommentsSheet(): void {
    this.commentsSheetOpen.set(false);
    this.activePostId.set(null);
  }

  showLoginModal(): void {
    console.log('Parent Called');

    this.showLoginModalFlag.set(true);
  }

  showLoginModalForAction(action: 'like' | 'comment'): void {
    this.showLoginModalFlag.set(true);
  }

  hideLoginModal(): void {
    this.showLoginModalFlag.set(false);
  }

  onAuthSuccess(): void {
    this.hideLoginModal();
    // Auth success will trigger the effect to retry pending action
  }

  private retryPendingAction(): void {
    const action = this.pendingAction();
    if (!action) return;

    if (action.type === 'like' && action.postId) {
      this.performLike(action.postId);
    } else if (action.type === 'comment' && action.postId) {
      this.openCommentsSheet(action.postId);
    }

    // Execute callback if provided
    if (action.callback) {
      action.callback();
    }

    // Clear pending action
    this.pendingAction.set(null);
  }
}