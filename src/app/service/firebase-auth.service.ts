import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth'; //user auth module
import * as firebase from 'firebase/app';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { firestore } from 'firebase';
import { Router } from '@angular/router';
import { ChatService } from './chat.service';

// import { auth } from 'firebase/app'

@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthService {

  user$: Observable<any>;

  userIs: boolean;
  userData: firebase.User;

  constructor(private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private chatService: ChatService,
    private router: Router) {

    // this.afAuth.authState.subscribe(user => {
    //   if (user) {
    //     this.userData = user;
    //     this.userIs = true;
    //   } else {
    //     this.userIs = false;
    //   }
    // })

    //user is already logged in
    // this.user$ = this.afAuth.authState.pipe(switchMap(user => {
    //   if (user) {
    //     return this.firestore.doc<any>(`users/${user.uid}`).valueChanges();
    //   } else {
    //     return of(null);
    //   }
    // }))
  }

  // Returns true when user is looged in and email is verified
  // get isLoggedIn(): boolean {
  //   return this.userIs;
  // }

  doUserRegister(value, type: string) {
    return new Promise<any>((resolve, reject) => {
      this.afAuth.createUserWithEmailAndPassword(value.email, value.password)
        .then(res => {
          res.user.updateProfile({ displayName: value.name, photoURL: type }).then(() => {
            resolve(res);
          }).catch((_err) => reject(_err))
        }, err => reject(err))
    });
  }

  doLogin(value) {
    return new Promise<any>((resolve, reject) => {
      this.afAuth.signInWithEmailAndPassword(value.email, value.password)
        .then(res => {
          resolve(res);
        }, err => reject(err))
    });
  }

  async signOut() {
    await this.afAuth.signOut().then(() => this.router.navigate(['/']));
  }

}
