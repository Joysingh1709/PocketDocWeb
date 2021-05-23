import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavToggleService {

  //show nav flag
  private showNavSource = new BehaviorSubject(false);
  currentNavShow = this.showNavSource.asObservable();

  //show app loading flag
  private showLoadingSource = new BehaviorSubject(true);
  currentLoadingShow = this.showLoadingSource.asObservable();

  //show email loading flag
  private emailLoadingSource = new BehaviorSubject(false);
  currentEmailLoadingShow = this.emailLoadingSource.asObservable();

  //sidenav toggle flag
  private toggleSource = new BehaviorSubject(false);
  currentToggle = this.toggleSource.asObservable();

  constructor() { }

  //changes current toggle value
  changeToggleData(data: boolean) {
    this.toggleSource.next(data);
  }

  //changes current NavSource value
  changeNavShowData(data: boolean) {
    this.showNavSource.next(data);
  }

  //changes current LoadingSource value
  changeLoadingShowData(data: boolean) {
    this.showLoadingSource.next(data);
  }

  //changes current emailLoadingSource value
  changeEmailLoading(data: boolean) {
    this.emailLoadingSource.next(data);
  }
}
