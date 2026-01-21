import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameResult } from './memory-game.service';
import { FooterComponent } from "./footer/footer.component";

@Component({
  selector: 'app-game-result',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-2xl mx-auto">
      <div class="bg-white rounded-3xl shadow-2xl overflow-hidden">
        <!-- Result Header -->
        <div
          class="bg-gradient-to-r from-blue-500 to-purple-600 p-8 text-center"
        >
          @if (isNewWinner) {
          <div class="animate-bounce mb-4">
            <div class="text-6xl">🏆</div>
          </div>
          <h1 class="text-4xl font-bold text-white mb-2">
            New Champion Crowned!
          </h1>
          <p class="text-xl text-blue-100">You've set a new record! 🎉</p>
          } @else {
          <div class="mb-4">
            <div class="text-6xl">🎯</div>
          </div>
          <h1 class="text-4xl font-bold text-white mb-2">
            Challenge Complete!
          </h1>
          <p class="text-xl text-blue-100">
            Great effort! Keep practicing to beat the champion!
          </p>
          }
        </div>

        <!-- Result Body -->
        <div class="p-8">
          <!-- Stats Grid -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="bg-blue-50 rounded-2xl p-6 text-center">
              <div class="text-4xl font-bold text-blue-600 mb-2">
                {{ result.accuracy }}%
              </div>
              <div class="text-gray-700 font-medium">Accuracy</div>
              <div class="text-sm text-gray-500 mt-2">
                {{ result.correct }}/{{ result.total }} correct
              </div>
            </div>

            <div class="bg-green-50 rounded-2xl p-6 text-center">
              <div class="text-4xl font-bold text-green-600 mb-2">
                {{ result.timeTaken }}s
              </div>
              <div class="text-gray-700 font-medium">Time Taken</div>
              <div class="text-sm text-gray-500 mt-2">
                @if (result.timeTaken < 20) { ⚡ Lightning Fast! } @else if
                (result.timeTaken < 40) { 🏃 Good Pace! } @else { 🐢 Take your
                time }
              </div>
            </div>

            <div class="bg-purple-50 rounded-2xl p-6 text-center">
              <div class="text-4xl font-bold text-purple-600 mb-2">
                {{ result.correct }}
              </div>
              <div class="text-gray-700 font-medium">Correct Moves</div>
              <div class="text-sm text-gray-500 mt-2">
                Level: {{ result.level | titlecase }}
              </div>
            </div>
          </div>

          <!-- Performance Bar -->
          <div class="mb-8">
            <div class="flex justify-between mb-2">
              <span class="font-medium text-gray-700">Performance</span>
              <span
                class="font-bold"
                [ngClass]="{
                  'text-red-500': result.accuracy < 70,
                  'text-yellow-500':
                    result.accuracy >= 70 && result.accuracy < 90,
                  'text-green-500': result.accuracy >= 90
                }"
              >
                @if (result.accuracy >= 90) { Excellent! } @else if
                (result.accuracy >= 70) { Good! } @else { Needs Practice }
              </span>
            </div>
            <div class="h-4 bg-gray-200 rounded-full overflow-hidden">
              <div
                class="h-full rounded-full transition-all duration-1000"
                [ngClass]="{
                  'bg-red-500': result.accuracy < 70,
                  'bg-yellow-500':
                    result.accuracy >= 70 && result.accuracy < 90,
                  'bg-green-500': result.accuracy >= 90
                }"
                [style.width.%]="result.accuracy"
              ></div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex flex-col sm:flex-row gap-4">
            <button
              (click)="playAgain.emit()"
              class="flex-1 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-xl text-lg transition duration-200 transform hover:-translate-y-1 hover:shadow-xl flex items-center justify-center gap-2"
            >
              🔄 Play Again
            </button>

            @if (isNewWinner) {
            <button
              (click)="uploadPhoto.emit(result.playerId)"
              class="flex-1 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold rounded-xl text-lg transition duration-200 transform hover:-translate-y-1 hover:shadow-xl flex items-center justify-center gap-2"
            >
              📸 Upload Winner Photo
            </button>
            }

            <button
              (click)="shareResult()"
              class="flex-1 py-4 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold rounded-xl text-lg transition duration-200 transform hover:-translate-y-1 hover:shadow-xl flex items-center justify-center gap-2"
            >
              📱 Share Score
            </button>
          </div>

          <!-- Tips -->
          <div class="mt-8 p-6 bg-gray-50 rounded-2xl">
            <h3 class="font-bold text-gray-800 mb-3 text-lg">
              💡 Tips to Improve:
            </h3>
            <ul class="space-y-2 text-gray-600">
              <li>• Focus on color patterns rather than individual blocks</li>
              <li>• Practice with Easy level to build confidence</li>
              <li>• Try saying the color names out loud as you memorize</li>
              <li>• Stay calm and don't rush your clicks</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class GameResultComponent {
  @Input() result!: GameResult;
  @Input() isNewWinner = false;
  @Output() playAgain = new EventEmitter<void>();
  @Output() uploadPhoto = new EventEmitter<number>();

  shareResult() {
    const text = `I scored ${this.result.accuracy}% accuracy in the Memory Tower Challenge! Can you beat my score?`;

    if (navigator.share) {
      navigator.share({
        title: 'Memory Tower Challenge',
        text: text,
        url: window.location.href,
      });
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(text);
      alert('Result copied to clipboard!');
    }
  }
}
