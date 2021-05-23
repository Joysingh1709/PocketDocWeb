import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WindowScrollService {

  scrollY = new BehaviorSubject(0);
  currentScrollY$ = this.scrollY.asObservable();

  scrollEvent = new BehaviorSubject(null);
  currentScrollEvent$ = this.scrollEvent.asObservable();

  constructor() {
  }

  updateScrollY(value: number): void {
    this.scrollY.next(value);
  }

  updateScrollEvent(value: any): void {
    this.scrollEvent.next(value);
  }
}