import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import * as firebase from 'firebase';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { async } from 'rxjs/internal/scheduler/async';
import { ChatService } from './service/chat.service';
import { FirebaseAuthService } from './service/firebase-auth.service';
import { WindowScrollService } from './service/window-scroll.service';
import { NavToggleService } from './service/nav-toggle.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'PocketDoc';
  toggle: boolean = false;
  showNav: boolean = false;

  authUserData: any;
  emailLoader: string = "emailLoader";

  mode: string = "side";

  homeScreenLoader: string = "homeScreenLoader";
  hasBackdrop = false;

  fullUserData: any;

  scrollY$: number;

  onScrollSide(e) {
    this.windowScrollService.scrollY.next(this.getYPosition(e));
  }

  getYPosition(e: Event): number {
    return (e.target as Element).scrollTop;
  }

  constructor(private toggleService: NavToggleService,
    private router: Router,
    private windowScrollService: WindowScrollService,
    private spinner: NgxSpinnerService,
    private authService: FirebaseAuthService,
    private breakpointObserver: BreakpointObserver,
    private afAuth: AngularFireAuth,
    private dataService: ChatService
  ) {
    // Nothing in constructor
  }

  ngOnInit(): void {

    this.breakpointObserver.observe('(max-width: 599px)').subscribe((result) => {
      if (result.matches) {
        this.mode = "over";
        this.hasBackdrop = true;
      } else {
        this.mode = "side";
        this.hasBackdrop = false;
      }
    });


    this.toggleService.currentLoadingShow.subscribe((val) => {
      if (val) {
        this.spinner.show(this.homeScreenLoader);
      } else {
        this.spinner.hide(this.homeScreenLoader);
      }
    });

    this.toggleService.currentEmailLoadingShow.subscribe((val) => {
      if (val) {
        this.spinner.show(this.emailLoader);
      } else {
        this.spinner.hide(this.emailLoader);
      }
    });

    this.toggleService.currentToggle.subscribe((val) => {
      this.toggle = val;
    });

    this.toggleService.currentNavShow.subscribe((show) => {
      this.showNav = show;
    });

    this.afAuth.onAuthStateChanged(async (user) => {

      if (user) {

        this.authUserData = user;

        if (user.photoURL === "doctor") {

          firebase.firestore().collection("doctors")
            .doc(user.uid)
            .get()
            .then((doc) => {
              console.log("user already exists");
              this.fullUserData = doc.data();
              console.log(this.fullUserData);

              this.dataService.changeProfileData(this.fullUserData);
            })

        } else if (user.photoURL === "user") {

          firebase.firestore().collection("users")
            .doc(user.uid)
            .get()
            .then((doc) => {
              console.log("user already exists");
              this.fullUserData = doc.data();
              console.log(this.fullUserData);

              this.dataService.changeProfileData(this.fullUserData);
            })

        }

      } else {
        console.log("user is not there is app component");
      }
    });
  }

  resendVerification() {
    this.authUserData.sendEmailVerification();
  }

  onSignOut() {
    this.authService.signOut().then(() => {
      this.toggleService.changeNavShowData(false);
      this.toggleService.changeToggleData(false);
      this.toggleService.changeEmailLoading(false);
    });
  }

}
