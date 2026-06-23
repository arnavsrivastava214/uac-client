import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-battle-screen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './battle-screen.component.html',
  styleUrls: ['./battle-screen.component.scss']
})
export class BattleScreenComponent implements OnInit {

  roomCode = '';

  timer = 20;

  myName = 'You';
  opponentName = 'Opponent';

  myScore = 0;
  opponentScore = 0;

  myHealth = 100;
  opponentHealth = 100;

  selectedAnswer = '';

  questions: any[] = [];

  currentQuestionIndex = 0;

  totalQuestions = 0;

  question: any = null;




  constructor(
    private route: ActivatedRoute,
    private socketService: SocketService
  ) {}

  ngOnInit(): void {

    this.roomCode =
      this.route.snapshot.paramMap.get('roomCode') || '';

    this.socketService.onBattleStart(
      (data: any) => {

        console.log(
          'BATTLE START DATA',
          data
        );

        this.questions =
          data.questions || [];

        this.totalQuestions =
          data.totalQuestions || 0;

        this.currentQuestionIndex =
          data.currentQuestion || 0;

        this.question =
          this.questions[
            this.currentQuestionIndex
          ];

      }
    );

  }

  selectAnswer(option: string) {

    this.selectedAnswer =
      option;

  }

  submitAnswer() {

    if (!this.selectedAnswer) {
      return;
    }

    console.log(
      'Selected:',
      this.selectedAnswer
    );

  }

}