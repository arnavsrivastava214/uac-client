import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import {
  MemoryGameService,
  WinnerData,
  GameResult,
} from './memory-game.service';
import { GameStartComponent } from './game-start.component';
import { GamePlayComponent } from './game-play.component';
import { GameResultComponent } from './game-result.component';
import { WinnerBannerComponent } from './winner-banner.component';
import { WinnerUploadModalComponent } from './winner-upload-modal.component';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './headers/header/header.component';

@Component({
  selector: 'app-memory-game-shell',
  standalone: true,
  imports: [
    CommonModule,
    GameStartComponent,
    GamePlayComponent,
    GameResultComponent,
    WinnerBannerComponent,
    WinnerUploadModalComponent,
    CommonModule,
    FormsModule,
    HeaderComponent
  ],
  template: `
  <app-header></app-header>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50" style="padding:130px 0;">
  <!-- Winner Banner -->
      <app-winner-banner [winnerData]="currentWinner()" />

      <div class="container mx-auto px-4 py-8">
        <div class="flex flex-col lg:flex-row gap-8">
          <!-- Game Area -->
          <main class="flex-1">
            <div class="max-w-4xl mx-auto">
              <!-- Game Title -->
              <div class="text-center mb-8">
                <h1 class="text-4xl md:text-5xl font-bold text-gray-800 mb-3">
                  🧠 Memory Tower Challenge
                </h1>
                <p class="text-gray-600 text-lg">
                  Watch the sequence and repeat it to win!
                </p>
              </div>

              <!-- Game State Router -->
              @switch (gameState()) { @case ('start') {
              <app-game-start (gameStart)="onGameStart($event)" />
              } @case ('playing') {
              <app-game-play
                [playerId]="playerId()!"
                [level]="selectedLevel()!"
                (gameComplete)="onGameComplete($event)"
                (gameCancel)="resetGame()"
              />
              } @case ('result') {
              <app-game-result
                [result]="gameResult()!"
                [isNewWinner]="isNewWinner()"
                (playAgain)="resetGame()"
                (uploadPhoto)="openUploadModal($event)"
              />
              } }
            </div>
          </main>

          <!-- Leaderboard Sidebar -->
          @if (gameState() !== 'playing') {
          <aside class="lg:w-1/3">
            <div class="bg-white rounded-2xl shadow-xl p-6 sticky top-8">
              <h2
                class="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2"
              >
                🏆 Leaderboard
                <select
                  [(ngModel)]="selectedLeaderboardLevel"
                  (change)="onLevelChange()"
                  class="ml-2 px-3 py-1 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </h2>

              <div class="space-y-3">
                @for (entry of leaderboard(); track entry.playerId; let i =
                $index) {
                <div
                  [class]="
                    'p-4 rounded-xl border ' +
                    (entry.playerId === currentWinner()?.playerId
                      ? 'bg-yellow-50 border-yellow-200'
                      : 'bg-gray-50 border-gray-200')
                  "
                >
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                      <div
                        [class]="
                          'w-8 h-8 rounded-full flex items-center justify-center font-bold ' +
                          (i === 0
                            ? 'bg-yellow-500 text-white'
                            : i === 1
                            ? 'bg-gray-400 text-white'
                            : i === 2
                            ? 'bg-amber-700 text-white'
                            : 'bg-gray-200 text-gray-700')
                        "
                      >
                        {{ i + 1 }}
                      </div>
                      <div class="flex items-center gap-2">
                        @if (entry.photoUrl) {
                        <img
                          [src]="entry.photoUrl"
                          [alt]="entry.name"
                          class="w-20 h-20 rounded-full object-cover"
                        />
                        }
                        <div>
                          <div class="font-semibold">{{ entry.name }}</div>
                          <div class="text-xs text-gray-500 capitalize">
                            {{ entry.level }}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="text-right">
                      <div class="font-bold text-lg">{{ entry.accuracy }}%</div>
                      <div class="text-sm text-gray-500">
                        {{ entry.timeTaken }}s
                      </div>
                    </div>
                  </div>
                </div>
                }
              </div>

              <div class="mt-8 pt-6 border-t border-gray-200">
                <h3 class="font-bold text-gray-700 mb-3">How to play:</h3>
                <ul class="space-y-2 text-sm text-gray-600">
                  <li>1. Watch the color sequence carefully</li>
                  <li>2. Memorize the order of blocks</li>
                  <li>3. Repeat the sequence in the same order</li>
                  <li>4. Score high accuracy and fast time!</li>
                </ul>
              </div>
            </div>
          </aside>
          }
        </div>
      </div>

      <!-- Winner Upload Modal -->
      @if (isUploadModalOpen()) {
      <app-winner-upload-modal
        [playerId]="uploadPlayerId()!"
        [playerName]="playerName()!"
        (close)="closeUploadModal()"
        (uploadComplete)="onUploadComplete()"
      />
      }
    </div>
  `,
})
export class MemoryGameShellComponent implements OnInit {
  private gameService = inject(MemoryGameService);

  // State signals
  gameState = signal<'start' | 'playing' | 'result'>('start');
  playerId = signal<number | null>(null);
  playerName = signal<string>('');
  selectedLevel = signal<'easy' | 'medium' | 'hard'>('easy');
  gameResult = signal<GameResult | null>(null);
  isNewWinner = signal(false);
  isUploadModalOpen = signal(false);
  uploadPlayerId = signal<number | null>(null);
  currentWinner = signal<WinnerData | null>(null);
  leaderboard = signal<any[]>([]);
  selectedLeaderboardLevel = 'easy';

  ngOnInit() {
    this.loadCurrentWinner();
    this.loadLeaderboard();
  }

  onGameStart(data: {
    playerId: number;
    name: string;
    level: 'easy' | 'medium' | 'hard';
  }) {
    this.playerId.set(data.playerId);
    this.playerName.set(data.name);
    this.selectedLevel.set(data.level);
    this.gameState.set('playing');
  }

  onGameComplete(result: GameResult) {
    this.gameService.saveResult(result).subscribe({
      next: (response) => {
        this.gameResult.set(result);
        this.isNewWinner.set(response.isNewWinner);
        this.gameState.set('result');

        if (response.isNewWinner && response.winnerData) {
          this.currentWinner.set(response.winnerData);
        }

        // Refresh leaderboard
        this.loadLeaderboard();
      },
      error: (error) => {
        console.error('Error saving result:', error);
        this.gameState.set('result');
      },
    });
  }

  resetGame() {
    this.gameState.set('start');
    this.gameResult.set(null);
    this.isNewWinner.set(false);
  }

  openUploadModal(playerId: number) {
    this.uploadPlayerId.set(playerId);
    this.isUploadModalOpen.set(true);
  }

  closeUploadModal() {
    this.isUploadModalOpen.set(false);
    this.uploadPlayerId.set(null);
  }

  onUploadComplete() {
    this.closeUploadModal();
    this.loadCurrentWinner();
    this.loadLeaderboard();
  }

  loadCurrentWinner() {
    this.gameService.getCurrentWinner(this.selectedLeaderboardLevel as any).subscribe({
      next: (winner) => this.currentWinner.set(winner),
      error: () => {
        if (this.leaderboard().length > 0) {
          const winner = this.leaderboard()[0];
          this.currentWinner.set({
            playerId: winner.playerId,
            name: winner.name,
            accuracy: winner.accuracy,
            timeTaken: winner.timeTaken,
            level: winner.level,
            photoUrl: winner.photoUrl,
          });
        }
      },
    });
  }
  

  loadLeaderboard() {
    this.gameService.getLeaderboard(this.selectedLeaderboardLevel).subscribe({
      next: (res: any) => this.leaderboard.set(res.data || []),
      error: () => {
        // Mock data for development
        this.leaderboard.set([
          {
            rank: 1,
            playerId: 1,
            name: 'Arnav',
            accuracy: 100,
            timeTaken: 15,
            level: 'easy',
          },
          {
            rank: 2,
            playerId: 2,
            name: 'Priya',
            accuracy: 95,
            timeTaken: 18,
            level: 'easy',
          },
          {
            rank: 3,
            playerId: 3,
            name: 'Rohan',
            accuracy: 92,
            timeTaken: 20,
            level: 'easy',
          },
        ]);
      },
    });
  }

  onLevelChange() {
    this.loadLeaderboard();
    this.loadCurrentWinner();
  }
  
}
