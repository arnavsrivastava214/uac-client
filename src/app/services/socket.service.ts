import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({
providedIn: 'root'
})
export class SocketService {

private socket!: Socket;

connect() {

this.socket = io(
  'https://uac-server.onrender.com',
  {
    transports: ['websocket']
  }
);

}

disconnect() {

if (this.socket) {
  this.socket.disconnect();
}

}

createRoom(data: any) {

this.socket.emit(
  'create-room',
  data
);

}

joinRoom(data: any) {

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

this.socket.on(
  'player-joined',
  callback
);

}

onBattleStart(callback: any) {

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

this.socket.on(
  'error-message',
  callback
);

}

}
