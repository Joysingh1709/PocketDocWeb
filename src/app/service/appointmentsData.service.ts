import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth'; //user auth module
import firebase from 'firebase/app';
import { BehaviorSubject } from 'rxjs';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import firestore from 'firebase';
import { Router } from '@angular/router';
import { ChatService } from './chat.service';

// import { auth } from 'firebase/app'

@Injectable({
    providedIn: 'root'
})
export class AppointmentsDataService {
    constructor() { }

    private allAppointmentsDataSource = new BehaviorSubject(true);
    allCurrentAppointmentsData = this.allAppointmentsDataSource.asObservable();

    //changes current toggle value
    changeAppointmentsData(data: boolean) {
        this.allAppointmentsDataSource.next(data);
    }
}