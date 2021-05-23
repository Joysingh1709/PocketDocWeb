import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavToggleService {

  private showNavSource = new BehaviorSubject(false);
  currentNavShow = this.showNavSource.asObservable();

  private showLoadingSource = new BehaviorSubject(true);
  currentLoadingShow = this.showLoadingSource.asObservable();

  private emailLoadingSource = new BehaviorSubject(false);
  currentEmailLoadingShow = this.emailLoadingSource.asObservable();

  private toggleSource = new BehaviorSubject(false);
  currentToggle = this.toggleSource.asObservable();

  constructor() { }

  //changes current toggle value
  changeToggleData(data: boolean) {
    this.toggleSource.next(data);
  }

  //changes current toggle value
  changeNavShowData(data: boolean) {
    this.showNavSource.next(data);
  }

  //changes current toggle value
  changeLoadingShowData(data: boolean) {
    this.showLoadingSource.next(data);
  }

  //changes current toggle value
  changeEmailLoading(data: boolean) {
    this.emailLoadingSource.next(data);
  }
}
