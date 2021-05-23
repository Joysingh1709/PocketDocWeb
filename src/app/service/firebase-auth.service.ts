import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth'; //user auth module
import firebase from 'firebase/app';
import { Observable, of } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthService {

  user$: Observable<any>;

  userIs: boolean;
  userData: firebase.User;

  constructor(
    private router: Router) {
  }

  doUserRegister(value, type: string) {
    return new Promise<any>((resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(value.email, value.password)
        .then(res => {
          res.user.updateProfile({ displayName: value.name, photoURL: type }).then(() => {
            resolve(res);
          }).catch((_err) => reject(_err))
        }, err => reject(err))
    });
  }

  doLogin(value) {
    return new Promise<any>((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(value.email, value.password)
        .then(res => {
          resolve(res);
        }, err => reject(err))
    });
  }

  async signOut() {
    await firebase.auth().signOut().then(() => this.router.navigate(['/']));
  }

}
