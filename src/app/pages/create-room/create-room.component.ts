import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SocketService } from '../../services/socket.service';
import { BattleService } from '../../services/battle.service';
import { AlertService } from '../../services/alert.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-create-room',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.scss'],
})
export class CreateRoomComponent {
  className = '';
  subject = '';
  difficulty = 'easy';
  questionCount = 10;
  mode: 'create' | 'join' = 'create';
  joinRoomCode = '';
  isLoading = false;

  constructor(
    private battleService: BattleService,
    private socketService: SocketService,
    private router: Router,
    private alert: AlertService
  ) {}

  ngOnInit() {
    this.socketService.onError((message: string) => {
      this.alert.error(message);
    });
  }

  createRoom() {
    if (!this.className || !this.subject || !this.difficulty) {
      this.alert.warning('Please fill all required fields');

      return;
    }
    this.isLoading = true;
    this.alert.info('Creating battle room...');
    this.socketService.connect();
    const payload = {
      className: this.className,
      subject: this.subject,
      difficulty: this.difficulty,
      questionCount: this.questionCount,
    };
    this.battleService.createRoom(payload, (response: any) => {
      this.isLoading = false;
      if (!response.success) {
        this.alert.error(response.message || 'Failed to create room');
        return;
      }
      const roomCode = response.roomCode;
      const user = JSON.parse(localStorage.getItem('uacUser') || '{}');
      this.socketService.createRoom({
        roomCode,
        user: {
          id: user.id || Date.now(),

          name: user.name || 'Player',
        },
        battleConfig: {
          className: this.className,
          subject: this.subject,

          difficulty: this.difficulty,
          questionCount: this.questionCount,
        },
      });
      this.alert.success(`Battle Room Created: ${roomCode}`);
      console.log('Room Created:', roomCode);
      this.router.navigate(['/battle/lobby', roomCode]);
    });
  }


  joinRoom() {
    if (!this.joinRoomCode.trim()) {
      this.alert.warning('Please enter room code');
      return;
    }

    this.socketService.connect();
    const user = JSON.parse(localStorage.getItem('uacUser') || '{}');
    this.socketService.joinRoom({
      roomCode: this.joinRoomCode.trim().toUpperCase(),
      user: {
        id: user.id || Date.now(),
        name: user.name || 'Player',
      },
    });
    this.alert.success('Joining battle room...');

    this.router.navigate([
      '/battle/lobby',
      this.joinRoomCode.trim().toUpperCase(),
    ]);
  }
}
