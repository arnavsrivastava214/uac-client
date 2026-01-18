import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../environments/environment';

export interface Player {
  name: string;
  mobile?: string;
  email?: string;
}

export interface PlayerResponse {
  playerId: number;
}

export interface GameResult {
  playerId: number;
  level: 'easy' | 'medium' | 'hard';
  total: number;
  correct: number;
  wrong: number;
  accuracy: number;
  timeTaken: number;
}

export interface ResultResponse {
  message: string;
  resultId: number;
  isNewWinner: boolean;
  winnerData?: WinnerData;
}

export interface WinnerData {
  playerId: number;
  name: string;
  accuracy: number;
  timeTaken: number;
  level: string;
  photoUrl?: string;
}

export interface LeaderboardEntry {
  rank: number;
  playerId: number;
  name: string;
  accuracy: number;
  timeTaken: number;
  level: string;
  photoUrl?: string;
  date: string;
}

@Injectable({
  providedIn: 'root',
})
export class MemoryGameService {
private apiUrl = 'https://uac-server.onrender.com/api/uac/memory-game';

  constructor(private http: HttpClient) {}

  createPlayer(player: Player): Observable<PlayerResponse> {
    return this.http.post<PlayerResponse>(`${this.apiUrl}/player`, player);
  }

  saveResult(result: GameResult): Observable<ResultResponse> {
    return this.http.post<ResultResponse>(`${this.apiUrl}/result`, result);
  }

  getLeaderboard(level: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/leaderboard?level=${level}`);
  }
  
  uploadWinnerPhoto(playerId: number, photo: File): Observable<any> {
    const formData = new FormData();
    formData.append('playerId', playerId.toString());
    formData.append('photo', photo);
    return this.http.post(`${this.apiUrl}/winner/upload-photo`, formData);
  }
  getCurrentWinner(level: 'easy' | 'medium' | 'hard'): Observable<WinnerData> {
    return this.http.get<WinnerData>(`${this.apiUrl}/winner/current?level=${level}`);
  }
  
  
  
}
