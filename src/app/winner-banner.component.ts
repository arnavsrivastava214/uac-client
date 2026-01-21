import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WinnerData } from './memory-game.service';

@Component({
  selector: 'app-winner-banner',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (winnerData) {
    <div class="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-200">
      <div class="container mx-auto px-4 py-3">
        <div class="flex flex-col md:flex-row items-center justify-between gap-4">

          <!-- Left: Winner Info -->
          <div class="flex items-center gap-4">
            <div class="relative">
              @if (winnerData.photoUrl) {
              <img
                [src]="winnerData.photoUrl"
                [alt]="winnerData.name"
                class="w-12 h-12 rounded-full border-4 border-white shadow-lg object-cover"
              />
              } @else {
              <div
                class="w-12 h-12 rounded-full border-4 border-white bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg flex items-center justify-center"
              >
                <span class="text-white font-bold text-xl">
                  {{ winnerData.name.charAt(0) }}
                </span>
              </div>
              }
              <div
                class="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full"
              >
                👑
              </div>
            </div>

            <div>
              <div class="flex items-center gap-2">
                <span class="font-bold text-gray-900 text-lg">
                  {{ winnerData.name }}
                </span>
                <span
                  class="bg-white text-yellow-600 text-xs font-bold px-2 py-1 rounded-full"
                >
                  CHAMPION
                </span>
              </div>
              <div class="text-sm text-gray-800">
                {{ winnerData.accuracy }}% accuracy •
                {{ winnerData.timeTaken }}s •
                {{ winnerData.level | titlecase }} Level
              </div>

              <!-- ✅ NEW: Runner-ups button -->
              <button
                class="mt-2 bg-white text-gray-900 text-xs font-bold px-3 py-1 rounded-full shadow hover:bg-gray-100"
              >
                🥈 Runner-ups
              </button>
            </div>
          </div>

          <!-- Right: Trophy -->
          <div class="flex items-center gap-6">
            <div
              class="hidden md:flex items-center gap-3 bg-white/80 px-4 py-2 rounded-full"
            >
              <div class="text-yellow-600 font-bold">🏆</div>
              <span class="text-gray-800 font-semibold">Current Winner</span>
            </div>

            <div class="animate-pulse">
              <div class="text-3xl">🏆</div>
            </div>
          </div>

        </div>
      </div>
    </div>
    } @else {
    <div class="bg-gradient-to-r from-gray-200 to-gray-300">
      <div class="container mx-auto px-4 py-3">
        <div class="flex items-center justify-center gap-3">
          <div class="text-2xl">🏆</div>
          <div class="text-gray-800 font-semibold">
            No champion yet! Be the first to claim the crown!
          </div>
          <div class="text-2xl">👑</div>
        </div>
      </div>
    </div>
    }
  `,
})
export class WinnerBannerComponent {
  @Input() winnerData: WinnerData | null = null;
}
