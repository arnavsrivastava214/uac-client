import {
  Component,
  Input,
  Output,
  EventEmitter,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MemoryGameService } from './memory-game.service';

@Component({
  selector: 'app-winner-upload-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 z-50 overflow-y-auto">
      <!-- Overlay -->
      <div
        class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        (click)="close.emit()"
      ></div>

      <!-- Modal -->
      <div class="flex min-h-full items-center justify-center p-4">
        <div
          class="relative w-full max-w-md transform overflow-hidden rounded-3xl bg-white shadow-2xl transition-all"
        >
          <!-- Header -->
          <div
            class="bg-gradient-to-r from-yellow-400 to-orange-500 p-8 text-center"
          >
            <div class="text-6xl mb-4 animate-bounce">🎉</div>
            <h2 class="text-3xl font-bold text-white">
              You're the New Champion!
            </h2>
            <p class="text-yellow-100 mt-2">
              Upload your photo to be featured on the winner banner
            </p>
          </div>

          <!-- Body -->
          <div class="p-8">
            <!-- Preview -->
            <div class="mb-8 text-center">
              @if (previewUrl()) {
              <div class="relative inline-block">
                <img
                  [src]="previewUrl()"
                  alt="Preview"
                  class="w-48 h-48 rounded-full object-cover border-8 border-yellow-100 shadow-xl"
                />
                <button
                  (click)="removePhoto()"
                  class="absolute -top-2 -right-2 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-600"
                >
                  ×
                </button>
              </div>
              } @else {
              <div
                class="w-48 h-48 mx-auto rounded-full border-8 border-dashed border-gray-300 flex items-center justify-center bg-gray-50"
              >
                <div class="text-center">
                  <div class="text-4xl mb-2">📷</div>
                  <div class="text-gray-500">No photo selected</div>
                </div>
              </div>
              }
            </div>

            <!-- Upload Button -->
            <div class="mb-6">
              <input
                type="file"
                id="photoUpload"
                accept="image/*"
                (change)="onFileSelected($event)"
                class="hidden"
                [disabled]="isUploading()"
              />
              <label
                for="photoUpload"
                [class]="
                  'block w-full py-4 rounded-xl text-center font-bold text-lg cursor-pointer transition duration-200 ' +
                  (isUploading()
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white transform hover:-translate-y-1')
                "
              >
                @if (isUploading()) {
                <span class="flex items-center justify-center">
                  <svg
                    class="animate-spin h-5 w-5 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    ></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Uploading...
                </span>
                } @else { 📸 Choose Your Champion Photo }
              </label>
            </div>

            <!-- Info -->
            <div class="bg-blue-50 rounded-xl p-4 mb-6">
              <p class="text-sm text-blue-800">
                Your photo will be displayed on the winner banner for everyone
                to see! Make it a good one! 😎
              </p>
            </div>

            <!-- Actions -->
            <div class="flex gap-4">
              <button
                (click)="close.emit()"
                [disabled]="isUploading()"
                class="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-xl transition duration-200"
              >
                Skip for Now
              </button>

              <button
                (click)="uploadPhoto()"
                [disabled]="!selectedFile() || isUploading()"
                [class]="
                  'flex-1 py-3 font-bold rounded-xl transition duration-200 ' +
                  (!selectedFile() || isUploading()
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white transform hover:-translate-y-1')
                "
              >
                Save Photo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Toast -->
    @if (showSuccess()) {
    <div class="fixed top-4 right-4 z-50 animate-slide-in">
      <div
        class="bg-green-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3"
      >
        <div class="text-2xl">✅</div>
        <div>
          <div class="font-bold">Photo uploaded successfully!</div>
          <div class="text-sm">You're now officially the champion!</div>
        </div>
      </div>
    </div>
    }
  `,
  styles: [
    `
      @keyframes slide-in {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }

      .animate-slide-in {
        animation: slide-in 0.3s ease-out;
      }
    `,
  ],
})
export class WinnerUploadModalComponent {
  @Input() playerId!: number;
  @Input() playerName!: string;
  @Output() close = new EventEmitter<void>();
  @Output() uploadComplete = new EventEmitter<void>();

  private gameService = inject(MemoryGameService);

  selectedFile = signal<File | null>(null);
  previewUrl = signal<string | null>(null);
  isUploading = signal(false);
  showSuccess = signal(false);

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.selectedFile.set(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewUrl.set(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  removePhoto() {
    this.selectedFile.set(null);
    this.previewUrl.set(null);
  }

  uploadPhoto() {
    if (!this.selectedFile() || !this.playerId) return;

    this.isUploading.set(true);

    this.gameService
      .uploadWinnerPhoto(this.playerId, this.selectedFile()!)
      .subscribe({
        next: () => {
          this.isUploading.set(false);
          this.showSuccess.set(true);

          // Close modal after delay
          setTimeout(() => {
            this.uploadComplete.emit();
          }, 2000);
        },
        error: (error) => {
          console.error('Error uploading photo:', error);
          this.isUploading.set(false);
          alert('Failed to upload photo. Please try again.');
        },
      });
  }
}
