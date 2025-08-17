import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseServiceService } from './base-service.service';

@Injectable({
  providedIn: 'root'
})
export class ApplicationServiceService extends BaseServiceService{

  constructor(http: HttpClient) {
    super(http);
  }


  createReview(params: any, callback: any) {
    return this.postData(params, this.httpUrls['createReview'], callback)
  }
  login(params: any, callback: any) {
    return this.postData(params, this.httpUrls['login'], callback)
  }
  sendRequest(params: any, callback: any) {
    return this.postData(params, this.httpUrls['sendRequest'], callback)
  }

  
  createTeacher(params: any, callback: any) {
    return this.postData(params, this.httpUrls['createTeacher'], callback)
  }

  getTeacherById(userId: string, callback: any) {
    return this.getData({}, this.httpUrls['getTeacherById'] + "/" + userId, callback)
  }
  
  updateTeacher(params: any, callback: any) {
    return this.putData(params, this.httpUrls['updateTeacher'], callback)
  }
  
  deleteTeacher(id: any, callback: any) {
    return this.deleteData({}, this.httpUrls['deleteTeacher'] + "/" + id, callback)
  }
  
  getAllReviews(callback: any) {
    return this.getData({}, this.httpUrls['getAllReviews'], callback)
  }

  fetchAllteacher(callback: any) {
    return this.getData({}, this.httpUrls['fetchAllteacher'], callback)
  }
}
