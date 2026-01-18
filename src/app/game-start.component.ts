import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { MemoryGameService } from './memory-game.service';
type LevelType = 'easy' | 'medium' | 'hard';

interface LevelConfig {
  value: LevelType;
  label: string;
  emoji: string;
  blocks: number;
  memorizeTime: number;
}

@Component({
  selector: 'app-game-start',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="max-w-md mx-auto">
      <div class="bg-white rounded-3xl shadow-2xl p-8">
        <h2 class="text-3xl font-bold text-center text-gray-800 mb-2">
          Enter Challenge
        </h2>
        <p class="text-gray-600 text-center mb-8">
          Test your memory and become the champion!
        </p>

        <form [formGroup]="startForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <!-- Name Input -->
          <div>
            <label class="block text-gray-700 mb-2 font-medium">
              Your Name *
            </label>
            <input
              type="text"
              formControlName="name"
              placeholder="Enter your name"
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200 outline-none"
              [class.border-red-500]="
                startForm.get('name')?.invalid && startForm.get('name')?.touched
              "
            />
            @if (startForm.get('name')?.invalid &&
            startForm.get('name')?.touched) {
            <p class="text-red-500 text-sm mt-1">Name is required</p>
            }
          </div>

          <!-- Contact Inputs -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-gray-700 mb-2 font-medium">
                Mobile (Optional)
              </label>
              <input
                type="tel"
                formControlName="mobile"
                placeholder="9999999999"
                class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200 outline-none"
              />
            </div>
            <div>
              <label class="block text-gray-700 mb-2 font-medium">
                Email (Optional)
              </label>
              <input
                type="email"
                formControlName="email"
                placeholder="your@email.com"
                class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200 outline-none"
              />
            </div>
          </div>

          <!-- Level Selection -->
          <div>
            <label class="block text-gray-700 mb-4 font-medium">
              Select Difficulty Level
            </label>
            <div class="grid grid-cols-3 gap-4">
              @for (level of levels; track level.value) {
              <button
                type="button"
                (click)="selectLevel(level.value)"
                [class]="
                  'py-4 rounded-xl border-2 transition-all duration-200 ' +
                  (selectedLevel === level.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700 scale-105'
                    : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50')
                "
              >
                <div class="text-2xl mb-2">{{ level.emoji }}</div>
                <div class="font-bold">{{ level.label }}</div>
                <div class="text-sm opacity-75 mt-1">
                  {{ level.blocks }} blocks • {{ level.memorizeTime }}s
                </div>
              </button>
              }
            </div>
          </div>

          <!-- Start Button -->
          <button
            type="submit"
            [disabled]="startForm.invalid || isLoading()"
            [class]="
              'w-full py-4 rounded-xl font-bold text-lg transition duration-200 ' +
              (startForm.invalid || isLoading()
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white transform hover:-translate-y-1 hover:shadow-xl')
            "
          >
            @if (isLoading()) {
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
              Starting Game...
            </span>
            } @else { 🎮 Start Memory Challenge }
          </button>

          <!-- Error Message -->
          @if (errorMessage()) {
          <div class="bg-red-50 border border-red-200 rounded-xl p-4">
            <p class="text-red-600">{{ errorMessage() }}</p>
          </div>
          }
        </form>

        <!-- Game Instructions -->
        <div class="mt-8 pt-6 border-t border-gray-200">
          <h3 class="font-bold text-gray-700 mb-3">🎯 How to Win:</h3>
          <ul class="space-y-2 text-sm text-gray-600">
            <li>• Memorize the sequence shown in the tower</li>
            <li>• Click blocks in the exact same order</li>
            <li>• Higher accuracy and faster time = better score</li>
            <li>• Beat the current winner to claim the crown!</li>
          </ul>
        </div>
      </div>
    </div>
  `,
})
export class GameStartComponent {
  @Output() gameStart = new EventEmitter<{
    playerId: number;
    name: string;
    level: 'easy' | 'medium' | 'hard';
  }>();

  private fb = inject(FormBuilder);
  private gameService = inject(MemoryGameService);

  startForm = this.fb.group({
    name: ['', Validators.required],
    mobile: [''],
    email: [''],
  });

  isLoading = signal(false);
  errorMessage = signal('');
  selectedLevel: LevelType = 'easy';

  levels: LevelConfig[] = [
    { value: 'easy', label: 'Easy', emoji: '😊', blocks: 6, memorizeTime: 3 },
    {
      value: 'medium',
      label: 'Medium',
      emoji: '😎',
      blocks: 10,
      memorizeTime: 4,
    },
    { value: 'hard', label: 'Hard', emoji: '🔥', blocks: 15, memorizeTime: 5 },
  ];

  selectLevel(level: LevelType) {
    this.selectedLevel = level;
  }

  onSubmit() {
    if (this.startForm.invalid) {
      this.startForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    const playerData = {
      name: this.startForm.value.name!,
      mobile: this.startForm.value.mobile || undefined,
      email: this.startForm.value.email || undefined,
    };

    this.gameService.createPlayer(playerData).subscribe({
      next: (response) => {
        this.gameStart.emit({
          playerId: response.playerId,
          name: playerData.name,
          level: this.selectedLevel,
        });
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error creating player:', error);
        this.errorMessage.set('Failed to start game. Please try again.');
        this.isLoading.set(false);
      },
    });
  }
}
