import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { SocketService } from '../../services/socket.service';
import { AlertService } from '../../services/alert.service';

@Component({
selector: 'app-waiting-lobby',
standalone: true,
imports: [CommonModule],
templateUrl: './waiting-lobby.component.html',
styleUrl: './waiting-lobby.component.scss'
})
export class WaitingLobbyComponent implements OnInit, OnDestroy {

roomCode = '';

playerJoined = false;

battleStarting = false;

opponent: any = null;

countdown = 3;

constructor(
private route: ActivatedRoute,
private router: Router,
private socketService: SocketService,
private alert: AlertService
) {}

ngOnInit(): void {

this.roomCode =
  this.route.snapshot.paramMap.get('roomCode') || '';

this.socketService.onPlayerJoined(
  (room: any) => {

    this.playerJoined = true;

    if (room?.players?.length > 1) {

      this.opponent =
        room.players[1];

    }

    this.alert.success(
      'Opponent joined the room'
    );

  }
);

this.socketService.onBattleStart(
  () => {

    this.alert.success(
      'Battle is starting'
    );

    this.startCountdown();

  }
);

this.socketService.onError(
  (message: string) => {

    this.alert.error(message);

  }
);

}

startCountdown() {

this.battleStarting = true;

const interval = setInterval(() => {

  this.countdown--;

  if (this.countdown === 0) {

    clearInterval(interval);

    this.router.navigate([
      '/battle/play',
      this.roomCode
    ]);

  }

}, 1000);

}

copyRoomCode() {
  navigator.clipboard.writeText(this.roomCode);

  this.alert.success(
    'Room code copied successfully. Share it with your opponent.'
  );
}

ngOnDestroy(): void {

this.socketService.disconnect();

}

}
