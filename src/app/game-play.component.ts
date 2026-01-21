import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameResult } from './memory-game.service';
import { FooterComponent } from './footer/footer.component';

const COLORS = [
  { name: 'red', bg: 'bg-red-500', light: 'bg-red-100', ring: 'ring-red-300' },
  {
    name: 'green',
    bg: 'bg-green-500',
    light: 'bg-green-100',
    ring: 'ring-green-300',
  },
  {
    name: 'blue',
    bg: 'bg-blue-500',
    light: 'bg-blue-100',
    ring: 'ring-blue-300',
  },
  {
    name: 'yellow',
    bg: 'bg-yellow-500',
    light: 'bg-yellow-100',
    ring: 'ring-yellow-300',
  },
  {
    name: 'pink',
    bg: 'bg-pink-500',
    light: 'bg-pink-100',
    ring: 'ring-pink-300',
  },
];

@Component({
  selector: 'app-game-play',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative">
      <!-- Header -->
      <div class="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 class="text-2xl font-bold text-gray-800">
              Level: <span class="capitalize">{{ level }}</span>
            </h2>
            <p class="text-gray-600">
              {{ getLevelInfo().blocks }} blocks • Memorize:
              {{ getLevelInfo().memorizeTime }}s
            </p>
          </div>

          <div class="flex items-center gap-6">
            <div class="text-center">
              <div class="text-sm text-gray-500">Time Taken</div>
              <div class="text-3xl font-bold text-blue-600">
                {{ formatTime(timeTaken()) }}
              </div>
            </div>

            <div class="text-center">
              <div class="text-sm text-gray-500">Placed</div>
              <div class="text-3xl font-bold text-green-600">
                {{ userSequence.length }}/{{ getLevelInfo().blocks }}
              </div>
            </div>

            <button
              (click)="cancelGame()"
              class="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      <!-- Game Card -->
      <div class="bg-white rounded-3xl shadow-2xl p-6 md:p-8">
        <!-- Phase Title -->
        @if (gamePhase() === 'memorize') {
        <div class="text-center mb-8">
          <div class="inline-block">
            <div class="text-4xl mb-3 font-extrabold text-gray-800">
              👁️ Memorize
            </div>
            <p class="text-lg text-gray-600">
              Watch carefully… sequence will flash now
            </p>
            <div class="mt-4 text-6xl font-bold text-blue-500 animate-bounce">
              {{ countdown() }}
            </div>
          </div>
        </div>
        } @if (gamePhase() === 'userTurn') {
        <div class="text-center mb-8">
          <div class="inline-block">
            <div class="text-4xl mb-3 font-extrabold text-gray-800">
              🎮 Build the Tower
            </div>
            <p class="text-lg text-gray-600">
              Pick blocks from below to rebuild the same sequence
            </p>
            <div class="mt-3 text-sm text-gray-500">
              Tip: click on the tower to <b>undo last block</b>
            </div>
          </div>
        </div>
        }

        <!-- Tower + Palette Layout -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <!-- Tower Area -->
          <div class="relative">
            <div
              class="relative w-full max-w-md mx-auto h-[560px] md:h-[720px] overflow-hidden rounded-3xl bg-gradient-to-b from-gray-50 to-white border border-gray-200 shadow-inner"
            >
              <!-- Memorize Tower (fixed) -->
              @if (gamePhase() === 'memorize') {
              <div class="absolute inset-0 flex items-end justify-center pb-10">
              <div class="relative h-full" [ngClass]="getTowerWidthClass()">
              @for (block of blocks; track block.index; let i = $index) {
                  <div
                    class="absolute left-0 right-0 mx-auto transition-all duration-300"
                    [style.bottom.px]="i * getBlockSpacing()"
                    [style.zIndex]="blocks.length - i"
                  >
                    <div
                      [class]="
                        getBlockSizeClass() +
                        ' rounded-2xl shadow-xl transition-all duration-200 ' +
                        (block.isActive
                          ? 'scale-110 ' + block.color.ring + ' ring-8'
                          : '')
                      "
                      [ngClass]="[
                        block.color.bg,
                        block.isActive ? 'shadow-2xl' : 'shadow-lg'
                      ]"
                    >
                      <div class="h-full flex items-center justify-center">
                        @if (block.isActive) {
                        <div class="text-white text-4xl animate-pulse">⚡</div>
                        } @else {
                        <div
                          class="text-white opacity-70 text-xl font-semibold"
                        >
                          {{ block.index + 1 }}
                        </div>
                        }
                      </div>
                    </div>
                  </div>
                  }

                  <!-- Base -->
                  <div
                    class="absolute bottom-2 left-1/2 -translate-x-1/2 w-72 md:w-96 h-4 bg-gray-900 rounded-full shadow-2xl"
                  ></div>
                </div>
              </div>
              }

              <!-- User Tower (build) -->
              @if (gamePhase() === 'userTurn') {
              <button
                type="button"
                class="absolute inset-0 w-full h-full text-left"
                (click)="undoLast()"
              >
                <div
                  class="absolute inset-0 flex items-end justify-center pb-10"
                >
                <div class="relative h-full" [ngClass]="getTowerWidthClass()">
                @for (idx of userSequence; track $index; let i = $index) {
                    <div
                      class="absolute left-0 right-0 mx-auto"
                      [style.bottom.px]="i * getBlockSpacing()"
                      [style.zIndex]="50 + i"
                    >
                      <div
                        [class]="getBlockSizeClass() + ' rounded-2xl shadow-xl'"
                        [ngClass]="COLORS[idx].bg"
                        style="animation: pop 220ms ease-out;"
                      ></div>
                    </div>
                    }

                    <!-- Empty hint -->
                    @if (userSequence.length === 0) {
                    <div
                      class="absolute inset-0 flex items-center justify-center"
                    >
                      <div class="text-center text-gray-400">
                        <div class="text-4xl mb-2">⬇️</div>
                        <div class="font-semibold">Pick a block below</div>
                      </div>
                    </div>
                    }

                    <!-- Base -->
                    <div
                      class="absolute bottom-2 left-1/2 -translate-x-1/2 w-72 md:w-96 h-4 bg-gray-900 rounded-full shadow-2xl"
                    ></div>
                  </div>
                </div>
              </button>

              <!-- Undo Floating Button -->
              <div class="absolute top-4 right-4">
                <button
                  (click)="undoLast()"
                  [disabled]="userSequence.length === 0"
                  class="px-4 py-2 rounded-xl font-bold shadow-lg transition
                        bg-gray-900 text-white hover:opacity-90 disabled:bg-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed"
                >
                  ↩ Undo
                </button>
              </div>
              }

              <!-- Processing -->
              @if (gamePhase() === 'processing') {
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="text-center">
                  <div class="text-5xl mb-3">🧠</div>
                  <div class="font-bold text-gray-800 text-xl">
                    Checking your tower…
                  </div>
                  <div class="text-gray-500 mt-1">Hold tight</div>
                </div>
              </div>
              }
            </div>
          </div>

          <!-- Palette Area -->
          <div class="relative">
            <div
              class="bg-gray-50 border border-gray-200 rounded-3xl p-6 shadow-inner"
            >
              <div class="flex items-center justify-between mb-4">
                <div>
                  <div class="text-xl font-extrabold text-gray-800">
                    🎨 Blocks
                  </div>
                  <div class="text-sm text-gray-500">Tap to add into tower</div>
                </div>

                <div class="text-sm text-gray-600">
                  <span class="font-bold text-gray-800">{{
                    userSequence.length
                  }}</span>
                  / {{ getLevelInfo().blocks }}
                </div>
              </div>

              <div class="grid grid-cols-5 gap-3 md:gap-4">
                @for (c of COLORS; track c.name; let i = $index) {
                <button
                  type="button"
                  (click)="onPalettePick(i)"
                  [disabled]="
                    gamePhase() !== 'userTurn' ||
                    userSequence.length >= sequence.length
                  "
                  class="h-14 md:h-16 rounded-2xl shadow-lg transition-all duration-200
                        hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                  [ngClass]="c.bg"
                ></button>
                }
              </div>

              <div class="mt-5 flex items-center justify-between">
                <div class="text-sm text-gray-600">
                  @if (gamePhase() === 'userTurn') { Build quietly… result will
                  show at the end 😄 } @else { Palette locked }
                </div>

                <button
                  type="button"
                  (click)="undoLast()"
                  [disabled]="
                    gamePhase() !== 'userTurn' || userSequence.length === 0
                  "
                  class="px-4 py-2 rounded-xl bg-white border border-gray-200 font-semibold hover:bg-gray-100 transition
                      disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Remove last
                </button>
              </div>
            </div>

            <!-- Mini helper -->
            @if (gamePhase() === 'userTurn') {
            <div class="mt-4 text-xs text-gray-500 text-center">
              No right/wrong shown now — final score will appear after
              completion.
            </div>
            }
          </div>
        </div>

        <!-- Status -->
        <div class="mt-10 text-center">
          @if (gamePhase() === 'memorize') {
          <div
            class="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-6 py-3 rounded-full"
          >
            <div class="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            <span class="text-lg">Sequence flashing…</span>
          </div>
          } @if (gamePhase() === 'userTurn') {
          <div
            class="inline-flex items-center gap-2 bg-green-50 text-green-700 px-6 py-3 rounded-full"
          >
            <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span class="text-lg">Pick blocks to rebuild the tower</span>
          </div>
          } @if (gamePhase() === 'processing') {
          <div
            class="inline-flex items-center gap-2 bg-purple-50 text-purple-700 px-6 py-3 rounded-full"
          >
            <svg
              class="animate-spin h-5 w-5"
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
            <span class="text-lg">Checking…</span>
          </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      @keyframes pop {
        0% {
          transform: translateY(18px) scale(0.96);
          opacity: 0;
        }
        100% {
          transform: translateY(0) scale(1);
          opacity: 1;
        }
      }
    `,
  ],
})
export class GamePlayComponent implements OnInit, OnDestroy {
  @Input() playerId!: number;
  @Input() level: 'easy' | 'medium' | 'hard' = 'easy';
  @Output() gameComplete = new EventEmitter<GameResult>();
  @Output() gameCancel = new EventEmitter<void>();

  gamePhase = signal<'memorize' | 'userTurn' | 'processing'>('memorize');
  timeTaken = signal(0);
  countdown = signal(0);

  // keep same blocks/sequence logic
  blocks: Array<{
    index: number;
    color: any;
    isActive: boolean;
    userClicked: boolean;
  }> = [];
  sequence: number[] = [];
  userSequence: number[] = [];

  startTime = 0;
  timerInterval: any;
  flashInterval: any;

  ngOnInit() {
    this.initializeGame();
  }

  ngOnDestroy() {
    this.clearIntervals();
  }

  getBlockSpacing(): number {
    const isMobile = window.innerWidth < 768;

    if (this.level === 'hard') return isMobile ? 30 : 40;
    if (this.level === 'medium') return isMobile ? 42 : 56;

    // easy
    return isMobile ? 56 : 78;
  }

  getBlockSizeClass(): string {
    if (this.level === 'hard') return 'w-52 h-7 md:w-64 md:h-10';
    if (this.level === 'medium') return 'w-60 h-12 md:w-72 md:h-16';
    return 'w-64 h-16 md:w-80 md:h-20';
  }

  getTowerWidthClass(): string {
    if (this.level === 'hard') return 'w-52 md:w-64';
    if (this.level === 'medium') return 'w-60 md:w-72';
    return 'w-64 md:w-80';
  }

  clearIntervals() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    if (this.flashInterval) clearInterval(this.flashInterval);
  }

  getLevelInfo() {
    const info = {
      easy: { blocks: 6, memorizeTime: 3 },
      medium: { blocks: 10, memorizeTime: 4 },
      hard: { blocks: 15, memorizeTime: 5 },
    };
    return info[this.level];
  }

  initializeGame() {
    const numBlocks = this.getLevelInfo().blocks;

    this.sequence = Array.from({ length: numBlocks }, () =>
      Math.floor(Math.random() * COLORS.length)
    );

    // memorize tower blocks (sequence fixed)
    this.blocks = Array.from({ length: numBlocks }, (_, i) => ({
      index: i,
      color: COLORS[this.sequence[i]],
      isActive: false,
      userClicked: false, // no longer used for UI ticks
    }));

    this.startMemorizePhase();
  }

  startMemorizePhase() {
    this.countdown.set(this.getLevelInfo().memorizeTime);

    const countdownInterval = setInterval(() => {
      this.countdown.update((val) => val - 1);
    }, 1000);

    let flashIndex = 0;
    this.flashInterval = setInterval(() => {
      if (flashIndex > 0) {
        this.blocks[this.sequence[flashIndex - 1]].isActive = false;
      }

      if (flashIndex < this.sequence.length) {
        this.blocks[this.sequence[flashIndex]].isActive = true;
        flashIndex++;
      } else {
        clearInterval(this.flashInterval);
        clearInterval(countdownInterval);

        this.blocks.forEach((block) => (block.isActive = false));

        setTimeout(() => {
          this.startUserTurn();
        }, 400);
      }
    }, 800);
  }

  startUserTurn() {
    this.gamePhase.set('userTurn');
    this.startTime = Date.now();

    this.timerInterval = setInterval(() => {
      this.timeTaken.set(Math.floor((Date.now() - this.startTime) / 1000));
    }, 1000);
  }

  // NEW: palette click = add block
  onPalettePick(colorIndex: number) {
    if (this.gamePhase() !== 'userTurn') return;
    if (this.userSequence.length >= this.sequence.length) return;

    this.userSequence.push(colorIndex);

    if (this.userSequence.length === this.sequence.length) {
      this.completeGame();
    }
  }

  // NEW: undo last
  undoLast() {
    if (this.gamePhase() !== 'userTurn') return;
    if (this.userSequence.length === 0) return;

    this.userSequence.pop();
  }

  completeGame() {
    this.clearIntervals();
    this.gamePhase.set('processing');

    let correct = 0;
    let wrong = 0;

    this.userSequence.forEach((selected, index) => {
      if (selected === this.sequence[index]) correct++;
      else wrong++;
    });

    const accuracy = (correct / this.sequence.length) * 100;

    const gameResult: GameResult = {
      playerId: this.playerId,
      level: this.level,
      total: this.sequence.length,
      correct,
      wrong,
      accuracy: parseFloat(accuracy.toFixed(2)),
      timeTaken: this.timeTaken(),
    };

    setTimeout(() => {
      this.gameComplete.emit(gameResult);
    }, 1200);
  }

  cancelGame() {
    this.clearIntervals();
    this.gameCancel.emit();
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0
      ? `${mins}:${secs.toString().padStart(2, '0')}`
      : `${secs}s`;
  }

  getColorName(color: any): string {
    return color.name.charAt(0).toUpperCase() + color.name.slice(1);
  }

  // expose colors in template
  protected readonly COLORS = COLORS;
}
