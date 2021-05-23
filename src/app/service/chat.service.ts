import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private NotifDataSource = new BehaviorSubject([]);
  currentNotifData = this.NotifDataSource.asObservable();

  private profileDataSource = new BehaviorSubject({});
  currentProfileData = this.profileDataSource.asObservable();

  constructor() { }

  //changes current Profiles data
  changeProfileData(data: any) {
    this.profileDataSource.next(data);
  }

  //changes current Profiles data
  changeNotifData(data: any) {
    this.NotifDataSource.next(data);
  }
}
