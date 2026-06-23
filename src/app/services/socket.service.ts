import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({
providedIn: 'root'
})
export class SocketService {

private socket!: Socket;

connect() {

  if (this.socket?.connected) {
    return;
  }
  this.socket = io(
    'https://uac-server.onrender.com'
  );
  this.socket.on('connect', () => {
    console.log(
      'SOCKET CONNECTED',
      this.socket.id
    );
  });

}

disconnect() {

if (this.socket) {
  this.socket.disconnect();
}

}

createRoom(data: any) {
  console.log('CREATE ROOM EMIT', data);

this.socket.emit(
  'create-room',
  data
);

}

joinRoom(data: any) {
  console.log('JOIN ROOM EMIT', data);

this.socket.emit(
  'join-room',
  data
);

}

submitAnswer(data: any) {
this.socket.emit(
  'submit-answer',
  data
);

}

onRoomCreated(callback: any) {

this.socket.on(
  'room-created',
  callback
);

}

onPlayerJoined(callback: any) {

  if (!this.socket) {
    return;
  }

  this.socket.on(
    'player-joined',
    callback
  );

}

onBattleStart(callback: any) {

  if (!this.socket) {
    return;
  }

  this.socket.on(
    'battle-start',
    callback
  );

}

onScoreUpdate(callback: any) {

this.socket.on(
  'score-update',
  callback
);

}

onError(callback: any) {

  if (!this.socket) {
    return;
  }

  this.socket.on(
    'error-message',
    callback
  );

}

}
