import { Component, Input, Output, EventEmitter, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { AdminPostService, PublicPost } from './services/admin-post.service';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [CommonModule],
  template: `
<article 
  class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] transform-gpu transition-transform"
>
  <!-- Image Section - Full Image Always Visible -->
  <div class="relative h-64 sm:h-72 md:h-80 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden flex items-center justify-center">
    <img 
      [src]="post().imageUrl" 
      [alt]="post().title"
      class="max-w-full max-h-full object-contain transition-transform duration-700 hover:scale-105"
      loading="lazy"
    />
    
    <!-- Gradient Overlay -->
    <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60"></div>
    
    <!-- Title Preview Overlay -->
  
    
    <!-- Date Badge with Glassmorphism -->
    <div class="absolute top-5 right-5">
      <span class="backdrop-blur-md bg-white/20 text-black text-sm font-semibold px-4 py-2 rounded-full border border-white/30 shadow-lg">
        {{ post().createdAt | date:'mediumDate' }}
      </span>
    </div>
  </div>

  <!-- Content Section -->
  <div class="p-5 sm:p-7">
    <!-- Title (repeated for accessibility) -->
    <h3 class="text-2xl font-bold text-gray-900 mb-4 pb-4 border-b border-gray-100">
      {{ post().title }}
    </h3>
    
    <!-- Engagement Meta Row -->
    <div class="flex items-center gap-6 mb-6 text-sm text-gray-500">
      <div class="flex items-center gap-2">
        <svg class="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
        <span class="font-semibold">{{ post().likeCount || 0 }}</span>
        <span class="hidden sm:inline">Likes</span>
      </div>
      
      <div class="flex items-center gap-2">
        <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
        </svg>
        <span>Comments</span>
      </div>
      
      <div class="flex items-center gap-2 ml-auto">
        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <span>Posted on {{ post().createdAt | date:'mediumDate' }}</span>
      </div>
    </div>

    <!-- Description Container -->
    <div class="mb-6 bg-gray-50/80 rounded-xl p-5 border border-gray-100">
      <p class="text-gray-700 leading-relaxed text-base sm:text-lg"
         [class.line-clamp-3]="!isExpanded()">
        {{ post().description }}
      </p>
      
      <button 
        *ngIf="post().description.length > 150"
        (click)="toggleExpand()"
        class="mt-4 text-blue-600 hover:text-blue-700 font-semibold text-sm transition-colors px-4 py-2 rounded-lg hover:bg-blue-50 w-full text-center"
      >
        {{ isExpanded() ? 'Show less' : 'Read more' }}
      </button>
    </div>

    <!-- Extra Engagement Section -->
    <div class="mb-7 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
      <p class="text-sm text-gray-700 text-center font-medium">
        Enjoyed this post? Tap like or share it with your friends. ✨
      </p>
    </div>

    <!-- Action Buttons -->
    <div class="flex flex-row sm:flex-row gap-3 pt-5 border-t border-gray-100">
      <!-- Like Button -->
      <button 
        (click)="onLike()"
        [disabled]="isLiking()"
        class="flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-full text-gray-700 hover:text-red-600 disabled:opacity-50 transition-all duration-300 group hover:bg-red-50 active:scale-95"
      >
        <div class="relative">
          <svg 
            class="w-7 h-7 transition-all duration-300 group-hover:scale-125 group-active:scale-110"
            [class.text-red-500]="post().isLikedByMe"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2.5" 
              [attr.d]="post().isLikedByMe ? 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' : 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'"
              [attr.fill]="post().isLikedByMe ? 'currentColor' : 'none'"
            />
          </svg>
          <div *ngIf="isLiking()" class="absolute -top-1 -right-1">
            <div class="animate-spin rounded-full h-5 w-5 border-2 border-red-500 border-t-transparent"></div>
          </div>
        </div>
        <span class="font-bold text-lg">{{ post().likeCount || 0 }}</span>
        <span class="font-semibold hidden sm:inline">Like</span>
        <span class="sr-only">likes</span>
      </button>

      <!-- Comment Button -->
      <button 
        (click)="onComment()"
        class="flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-full text-gray-700 hover:text-blue-600 transition-all duration-300 group hover:bg-blue-50 active:scale-95"
      >
        <svg 
          class="w-7 h-7 transition-all duration-300 group-hover:scale-125 group-active:scale-110"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <span class="font-semibold hidden sm:inline">Comment</span>
        <span class="font-bold text-lg sm:hidden">💬</span>
      </button>

      <!-- Share Button -->
      <button 
        (click)="onShare()"
        class="flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-full text-gray-700 hover:text-green-600 transition-all duration-300 group hover:bg-green-50 active:scale-95"
      >
        <svg 
          class="w-7 h-7 transition-all duration-300 group-hover:scale-125 group-active:scale-110"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        <span class="font-semibold hidden sm:inline">Share</span>
        <span class="font-bold text-lg sm:hidden">🔗</span>
      </button>
    </div>
  </div>
</article>
  `,
  styles: [`
    :host {
      display: block;
    }
    
    .line-clamp-2 {
      overflow: hidden;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }
    
    .line-clamp-3 {
      overflow: hidden;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
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
export class PostCardComponent implements OnInit {
    private authService = inject(AuthService);

    @Input()
    set data(value: PublicPost) {   // ✅ rename here
      this._post.set(value);
      this.originalPost.set({ ...value });
    }
    
    @Output() likeClicked = new EventEmitter<{postId: string, requireAuth: () => void}>();
    @Output() commentClicked = new EventEmitter<{postId: string, requireAuth: () => void}>();
    @Output() shareClicked = new EventEmitter<string>();
    
    private _post = signal<PublicPost>(null as any);
    
    // ✅ keep this
    post = computed(() => this._post());
    
    originalPost = signal<PublicPost>({} as PublicPost);
    isExpanded = signal(false);
    isLiking = signal(false);
    
  ngOnInit(): void {}

  toggleExpand(): void {
    this.isExpanded.set(!this.isExpanded());
  }

  onLike(): void {
    if (!this.authService.isLoggedIn()) {
      this.likeClicked.emit({
        postId: this.post().id,
        requireAuth: () => {
          // After successful auth, trigger optimistic like
          this.performLike();
        }
      });
      return;
    }
    
    this.performLike();
  }

  private performLike(): void {

    this.isLiking.set(true);
  
    // ✅ read signal value correctly
    const currentPost = this._post();
  
    const wasLiked = currentPost.isLikedByMe || false;
    const newCount = wasLiked
      ? (currentPost.likeCount || 0) - 1
      : (currentPost.likeCount || 0) + 1;
  
    // ✅ update signal correctly
    this._post.set({
      ...currentPost,
      isLikedByMe: !wasLiked,
      likeCount: newCount
    });
  
    // Emit to parent for API call
    this.likeClicked.emit({
      postId: currentPost.id,
      requireAuth: () => {}
    });
  }
  

  onComment(): void {
    if (!this.authService.isLoggedIn()) {
      this.commentClicked.emit({
        postId: this.post().id,
        requireAuth: () => {
          // After auth, parent will handle comment opening
          this.commentClicked.emit({
            postId: this.post().id,
            requireAuth: () => {}
          });
        }
      });
      return;
    }
    
    this.commentClicked.emit({
      postId: this.post().id,
      requireAuth: () => {}
    });
  }

  async onShare(): Promise<void> {
    const postUrl = `${window.location.origin}/posts/${this.post().id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: this.post().title,
          text: this.post().description.substring(0, 100),
          url: postUrl
        });
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          this.copyToClipboard(postUrl);
        }
      }
    } else {
      this.copyToClipboard(postUrl);
    }
  }

  private async copyToClipboard(text: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(text);
      // Show toast here
    } catch (error) {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      // Show toast here
    }
  }

  // Method to revert optimistic update on error
  revertLikeUpdate(): void {
    this._post.set(this.originalPost());
  }
}