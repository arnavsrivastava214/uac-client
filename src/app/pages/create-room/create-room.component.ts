import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SocketService } from '../../services/socket.service';
import { BattleService } from '../../services/battle.service';
@Component({
selector: 'app-create-room',
standalone: true,
imports: [FormsModule],
templateUrl: './create-room.component.html',
styleUrls: ['./create-room.component.scss']
})
export class CreateRoomComponent {

className = '';
subject = '';
difficulty = 'easy';
questionCount = 10;

isLoading = false;

constructor(
private battleService: BattleService,
private socketService: SocketService,
private router: Router
) {}

createRoom() {

this.isLoading = true;

this.socketService.connect();

const payload = {
  className: this.className,
  subject: this.subject,
  difficulty: this.difficulty
};

this.battleService.createRoom(
  payload,
  (response: any) => {

    this.isLoading = false;

    if (!response.success) {
      return;
    }

    const roomCode = response.roomCode;

    this.socketService.createRoom({
      roomCode,
      user: {
        id: 1,
        name: 'Host'
      }
    });

    this.router.navigate([
      '/battle/lobby',
      roomCode
    ]);

  }
);

}

}
