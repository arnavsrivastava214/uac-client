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

  // getUsersById(userId: string, callback: any) {
  //   return this.getData({}, this.httpUrls['getUsersById'] + "/" + userId, callback)
  // }
  
  // updateUsers(params: any, callback: any) {
  //   return this.putData(params, this.httpUrls['updateUsers'], callback)
  // }
  
  // deleteUsers(id: any, callback: any) {
  //   return this.deleteData({}, this.httpUrls['deleteUsers'] + "/" + id, callback)
  // }
  
  getAllReviews(callback: any) {
    return this.getData({}, this.httpUrls['getAllReviews'], callback)
  }

  fetchAllteacher(callback: any) {
    return this.getData({}, this.httpUrls['fetchAllteacher'], callback)
  }
}
