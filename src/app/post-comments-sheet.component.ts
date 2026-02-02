import { Component, Input, Output, EventEmitter, inject, signal, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { AuthService } from './services/auth.service';
import { AdminPostService, PostComment } from './services/admin-post.service';
@Component({
  selector: 'app-post-comments-sheet',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <!-- Backdrop -->
<!-- Backdrop -->
<div class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300"
     [class.hidden]="!isVisible()"
     [class.opacity-0]="!isVisible()"
     [class.opacity-100]="isVisible()"
     (click)="close()">
</div>

<!-- Bottom Sheet -->
<div class="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.3)] z-50 transform transition-all duration-300 ease-out max-h-[85vh] flex flex-col"
     [class.translate-y-full]="!isVisible()"
     [class.translate-y-0]="isVisible()"
     [class.opacity-0]="!isVisible()"
     [class.opacity-100]="isVisible()">
  
  <!-- Handle & Header -->
  <div class="sticky top-0 bg-white rounded-t-3xl z-10">
    <!-- Handle -->
    <div class="pt-5 pb-3 flex justify-center cursor-grab active:cursor-grabbing" (click)="close()">
      <div class="w-16 h-1.5 bg-gray-300 rounded-full hover:bg-gray-400 transition-colors"></div>
    </div>

    <!-- Header -->
    <div class="px-6 py-3 border-b border-gray-100">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div>
            <h2 class="text-2xl font-bold text-gray-900">Comments</h2>
            <div class="flex items-center gap-2 mt-1">
              <div class="flex items-center gap-1">
                <svg class="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
                <span class="text-sm text-gray-600 font-medium">{{ comments().length }}</span>
              </div>
              <span class="text-gray-400">•</span>
              <span class="text-sm text-gray-500">Share your thoughts</span>
            </div>
          </div>
        </div>
        <button 
          type="button" 
          (click)="close()"
          class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 active:scale-95 transition-all duration-200 group"
        >
          <svg class="w-6 h-6 text-gray-500 group-hover:text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  </div>

  <!-- Comments List -->
  <div class="flex-1 overflow-y-auto px-6 py-5">
    <!-- Loading -->
    <div *ngIf="isLoading()" class="space-y-6">
      <div *ngFor="let _ of [1,2,3]" class="animate-pulse">
        <div class="flex gap-4">
          <div class="flex-shrink-0">
            <div class="w-12 h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full"></div>
          </div>
          <div class="flex-1 space-y-3">
            <div class="flex items-center gap-3">
              <div class="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-32"></div>
              <div class="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-20"></div>
            </div>
            <div class="space-y-2">
              <div class="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-full"></div>
              <div class="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div *ngIf="!isLoading() && comments().length === 0" class="text-center py-16">
      <div class="relative mx-auto w-24 h-24 mb-6">
        <div class="absolute inset-0 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl opacity-60 blur-md"></div>
        <div class="relative w-24 h-24 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl flex items-center justify-center border border-blue-100">
          <svg class="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
      </div>
      <h3 class="text-2xl font-bold text-gray-900 mb-3">No comments yet</h3>
      <p class="text-gray-600 mb-6 max-w-md mx-auto">
        Be the first to share your thoughts on this post. Your insights could inspire others!
      </p>
      <div class="w-12 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mx-auto"></div>
    </div>

    <!-- Comments -->
    <div *ngFor="let comment of comments(); let i = index" 
         class="group flex gap-4 p-5 rounded-2xl hover:bg-gray-50 transition-all duration-300 animate-slide-up"
         [style.animation-delay]="(i * 0.05) + 's'">
      <!-- Avatar -->
      <div class="flex-shrink-0">
        <div class="relative">
          <div class="absolute -inset-1 bg-gradient-to-br from-blue-300 to-indigo-400 rounded-full blur-sm opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
          <div class="relative w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300">
            <span class="text-white font-bold text-lg">{{ comment.userName.charAt(0).toUpperCase() }}</span>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="flex-1">
        <div class="flex flex-wrap items-center gap-2 mb-3">
          <h4 class="font-bold text-gray-900 text-lg">{{ comment.userName }}</h4>
          <div class="flex items-center gap-2">
            <span class="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded-full">
              {{ comment.createdAt | date:'MMM d' }}
            </span>
            <span class="text-gray-400">•</span>
            <span class="text-xs text-gray-500">{{ comment.createdAt | date:'h:mm a' }}</span>
          </div>
        </div>
        <p class="text-gray-700 leading-relaxed bg-gradient-to-r from-gray-50 to-white p-4 rounded-xl border border-gray-100">
          {{ comment.comment }}
        </p>
        <div class="flex items-center gap-4 mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button class="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905a3.61 3.61 0 01-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"/>
            </svg>
            <span class="text-sm font-medium">Like</span>
          </button>
          <button class="flex items-center gap-2 text-gray-500 hover:text-green-600 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/>
            </svg>
            <span class="text-sm font-medium">Reply</span>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Add Comment Form -->
  <div class="sticky bottom-0 bg-white border-t border-gray-100 p-6 shadow-[0_-4px_20px_-8px_rgba(0,0,0,0.1)]">
    <!-- Auth Prompt -->
    <div *ngIf="!authService.isLoggedIn()" 
         class="mb-5 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border border-yellow-200 shadow-sm">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
          </svg>
        </div>
        <div class="flex-1">
          <p class="text-sm font-medium text-yellow-900">
            Sign in to join the conversation
          </p>
          <p class="text-xs text-yellow-700 mt-1">
            <button (click)="triggerAuth.emit()" 
                    class="text-blue-600 hover:text-blue-700 font-semibold underline decoration-2 underline-offset-2 hover:decoration-blue-500 transition-all">
              Login
            </button> to share your thoughts and connect with others
          </p>
        </div>
      </div>
    </div>

    <!-- Comment Form -->
    <form [formGroup]="commentForm" (ngSubmit)="submitComment()" class="space-y-4">
      <div class="flex items-center gap-3 mb-2">
        <div class="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center border border-blue-200">
          <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
          </svg>
        </div>
        <div>
          <h3 class="font-bold text-gray-900">Add a comment</h3>
          <p class="text-xs text-gray-500">Share your thoughts with the community</p>
        </div>
      </div>
      
      <div class="relative">
        <textarea
          rows="3"
          formControlName="comment"
          placeholder="What are your thoughts on this post?"
          class="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:outline-none transition-all duration-300 resize-none"
          [class.opacity-50]="!authService.isLoggedIn()"
          [disabled]="!authService.isLoggedIn()"
        ></textarea>
        <div class="absolute bottom-3 right-3 text-xs text-gray-500">
          {{ commentForm.get('comment')?.value?.length || 0 }}/500
        </div>
      </div>
      
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2 text-sm text-gray-500">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <span>Your comment will be public</span>
        </div>
        <button
          type="submit"
          [disabled]="commentForm.invalid || isSubmitting() || !authService.isLoggedIn()"
          class="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-95 flex items-center gap-2 group"
        >
          <div class="relative">
            <svg *ngIf="!isSubmitting()" 
                 class="w-5 h-5 transition-transform group-hover:translate-x-1" 
                 fill="none" 
                 stroke="currentColor" 
                 viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
            </svg>
            <div *ngIf="isSubmitting()" class="absolute inset-0 flex items-center justify-center">
              <div class="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
            </div>
          </div>
          <span>{{ isSubmitting() ? 'Posting...' : 'Post Comment' }}</span>
        </button>
      </div>
    </form>
  </div>
</div>
  `,
  styles: [`
    :host {
      display: block;
    }
    
    .animate-slide-up {
      animation: slideUp 0.3s ease-out;
    }
    
    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
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
export class PostCommentsSheetComponent implements OnInit, OnChanges {
  private fb = inject(FormBuilder);
  private adminPostService = inject(AdminPostService);
  protected authService = inject(AuthService);

  @Input() postId!: string;  // Changed from number to string
  @Input() isOpen = false;
  @Output() closed = new EventEmitter<void>();
  @Output() triggerAuth = new EventEmitter<void>();

  // State signals
  isVisible = signal(false);
  comments = signal<PostComment[]>([]);
  isLoading = signal(false);
  isSubmitting = signal(false);

  // Form
  commentForm: FormGroup;

  constructor() {
    this.commentForm = this.fb.group({
      comment: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.isVisible.set(this.isOpen);
    }, 10);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen'] && changes['isOpen'].currentValue) {
      this.isVisible.set(true);
      this.loadComments();
    }
    if (changes['postId'] && changes['postId'].currentValue) {
      this.loadComments();
    }
  }

  open(): void {
    this.isVisible.set(true);
    this.loadComments();
  }

  close(): void {
    this.isVisible.set(false);
    setTimeout(() => this.closed.emit(), 300);
  }

  loadComments(): void {
    if (!this.postId) return;

    this.isLoading.set(true);
    this.adminPostService.getComments(this.postId)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (comments) => {
          this.comments.set(comments);
        },
        error: (error) => {
          console.error('Failed to load comments', error);
        }
      });
  }

  submitComment(): void {
    if (this.commentForm.invalid || !this.authService.isLoggedIn()) return;

    this.isSubmitting.set(true);
    const comment = this.commentForm.get('comment')!.value;

    this.adminPostService.addComment(this.postId, { comment })
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: (newComment) => {
          // Optimistically add to list
          this.comments.update(comments => [
            {
              ...newComment,
              userName: this.authService.getUser()?.name || 'You'
            },
            ...comments
          ]);
          
          this.commentForm.reset();
          this.commentForm.markAsPristine();
        },
        error: (error) => {
          console.error('Failed to add comment', error);
        }
      });
  }
}