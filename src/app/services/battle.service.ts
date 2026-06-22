import { Injectable } from '@angular/core';
import { BaseServiceService } from './base-service.service';

@Injectable({
providedIn: 'root'
})
export class BattleService {

constructor(
private baseService: BaseServiceService
) {}

createRoom(data: any, callback: any) {

this.baseService.postData(
  data,
  this.baseService.httpUrls.createBattleRoom,
  callback
);

}

generateQuestions(data: any, callback: any) {

this.baseService.postData(
  data,
  this.baseService.httpUrls.generateBattleQuestions,
  callback
);

}

}
