import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import { environment } from '../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class BaseServiceService {

  token: any = '';

  constructor(public http: HttpClient) {
    this.token = 'uacAuthorization';
  }
  httpUrls: any = {
    'createReview': '/api/uac/review/createReview',
    'getAllReviews': '/api/uac/review/getAllReviews',
    
    //Auth
    
    'login': '/api/uac/auth/login',
    
    // contact
    'sendRequest': '/api/uac/contact/sendRequest',
    
    // teacher
    'fetchAllteacher': '/api/uac/teacher/fetchAllteacher',
    'createTeacher': '/api/uac/teacher/createTeacher',
    'deleteTeacher': '/api/uac/teacher/deleteTeacher',
    'getTeacherById': '/api/uac/teacher/getTeacherById',
    'updateTeacher': '/api/uac/teacher/updateTeacher',

    //game 

    // memory game
'createPlayer': '/api/uac/memory-game/player',
'saveResult': '/api/uac/memory-game/result',
'getLeaderboard': '/api/uac/memory-game/leaderboard',
'uploadWinnerPhoto': '/api/uac/memory-game/winner/upload-photo',

//battle routes
'createBattleRoom': '/api/uac/battle/create-room',
'generateBattleQuestions': '/api/uac/battle/generate-questions',





    
    

  }

  apiUrl = 'https://uac-server.onrender.com';

  
  getData(d: any, url: any, callback: any) {
    const headers: any = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    return this.http.get(this.apiUrl + url, { headers: headers }).subscribe((data: any) => { callback(data) }, (error: any) => callback(error));
  }

  postData(d: any, url: any, callback: any) {
    const headers: any = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    return this.http.post(this.apiUrl + url, d, { headers: headers }).subscribe((data: any) => { callback(data) }, (error: any) => callback(error));
  }

  putData(d: any, url: any, callback: any) {
    const headers: any = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    return this.http.put(this.apiUrl+ url, d, { headers: headers }).subscribe((data: any) => { callback(data) }, (error: any) => callback(error));
  }

  deleteData(d: any, url: any, callback: any) {
    const headers: any = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    return this.http.delete(this.apiUrl + url, { headers: headers }).subscribe((data: any) => { callback(data) }, (error: any) => callback(error));
  }
}
