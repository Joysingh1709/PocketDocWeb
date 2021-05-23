import { Component, Input, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import { AnimationOptions } from 'ngx-lottie';
import { ChatService } from 'src/app/service/chat.service';
import firestore from 'firebase/app';
import { FirebaseAuthService } from 'src/app/service/firebase-auth.service';
import { NavToggleService } from 'src/app/service/nav-toggle.service';

@Component({
  selector: 'app-profile-nav',
  templateUrl: './profile-nav.component.html',
  styleUrls: ['./profile-nav.component.css']
})
export class ProfileNavComponent implements OnInit {

  @Input('userData') userDataPassed: any;
  toggle: boolean;

  photoURL: string;
  name: string;

  notifColor: string = "#FFFFFF";
  notifName: string = "notifications_none";

  notifCount: number = 0;
  notifData = [];
  userID: string;
  userphotoURL: string;
  profiles: any;

  constructor(private authService: FirebaseAuthService,
    private afAuth: AngularFireAuth,
    private notificationService: ChatService,
    private navService: NavToggleService) {
    this.photoURL = firebase.auth().currentUser.photoURL;
  }

  // pocketDoc.json

  ngOnInit(): void {
    this.name = this.userDataPassed;
    this.navService.currentToggle.subscribe((val) => {
      this.toggle = val;
    });

    this.afAuth.onAuthStateChanged(async (user) => {
      this.userID = user.uid;
      this.userphotoURL = user.photoURL;
      console.log(this.userID);

      firebase.firestore().collection('chatRooms')
        .where("userId", "==", user.uid)
        .orderBy('lastUpdatedDate', 'desc')
        .onSnapshot(querysnapshot => {
          const thread = querysnapshot.docs.map(docSnap => {
            return docSnap.data();
          })
          this.profiles = thread;

          this.notificationService.changeNotifData(this.profiles);
        });

    });

    this.notificationService.currentNotifData.subscribe((notif) => {
      console.log("NEW NOTIFICATION");
      notif.forEach((e) => {
        if (e.doctorMessageCount > 0) {
          this.notifData.push(e);
        }
      });

      let count = 0;
      this.notifData.forEach((ele) => {
        ele.doctorMessageCount > 0 ? count += 1 : null;
      });

      this.notifCount = count;
    })
  }

  option: AnimationOptions = {
    path: '/assets/pocketDoc.json',
    loop: true,
    autoplay: true
  };

  styles: Partial<CSSStyleDeclaration> = {
    // width: '250px',
    // height: '250px'
  };

  onAnimeCreate(anim: any) {
    console.log(anim);
  }

  onNotifHover(event) {
    if (event.type === "mouseenter") {
      this.notifName = "notifications";
    } else if (event.type === "mouseleave") {
      this.notifName = "notifications_none";
    }
  }

  onSignOut() {
    this.authService.signOut().then(() => {
      this.navService.changeNavShowData(false);
      this.navService.changeToggleData(false);
    });
  }

  navToggle() {
    this.toggle = !this.toggle;
    this.navService.changeToggleData(this.toggle);
  }

}
