import { BreakpointObserver, MediaMatcher } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import firebase from 'firebase/app';
import firestore from 'firebase/app'
import { AnimationItem } from 'lottie-web';
import { BaseChartDirective, Color, Label } from 'ng2-charts';
import { AnimationOptions } from 'ngx-lottie';
// import { NgxSpinnerService } from 'ngx-spinner';
import { chatAnime, exapnButton } from 'src/app/animations/animation';
import { UpdateProfileDialogComponent } from 'src/app/dialogs/update-profile-dialog/update-profile-dialog.component';
import { ChatService } from 'src/app/service/chat.service';
import { FirebaseAuthService } from 'src/app/service/firebase-auth.service';
import { NavToggleService } from 'src/app/service/nav-toggle.service';

@Component({
  selector: 'app-doctor-home',
  templateUrl: './doctor-home.component.html',
  styleUrls: ['./doctor-home.component.css'],
  animations: [
    chatAnime(),
    exapnButton()
  ]
})
export class DoctorHomeComponent implements OnInit {

  providerData: any = [];
  email: string = "";

  fullDoctorData: any;

  openChatFlag: boolean = false;

  imgURL = "";
  progress = 0;
  user: any;
  name: any;

  imgFirst: any;
  imgAfter: any;
  uploadedImage: any;

  animeMessengerRef: any;
  fullUserData: any;
  triggerOpenClose: string = "close";
  breakpointFlag: boolean = false;

  constructor(private router: Router,
    // private spinner: NgxSpinnerService,
    private authService: FirebaseAuthService,
    private breakpointObserver: BreakpointObserver,
    private navService: NavToggleService,
    private dataService: ChatService,
    public dialog: MatDialog) {

    this.navService.changeLoadingShowData(true);

    console.log(firebase.auth().currentUser.photoURL);
    let role = firebase.auth().currentUser.photoURL;
    if (role === "user") {
      this.router.navigate(['user']);
    } else if (role === "doctor") {

      var user = firebase.auth().currentUser;

      if (!user.emailVerified) {
        setTimeout(() => {
          this.navService.changeLoadingShowData(false);
        }, 1000);

        user.sendEmailVerification()
          .then(res => {
            console.log(res);

            setInterval(() => {
              user.reload();
              // console.log(user.emailVerified);

              if (user.emailVerified) {
                // this.spinner.hide();
                clearInterval();
                //reload page so that it could fetch the user data again
                window.location.reload();
              }
            }, 2000);

          }, err => {
            console.log(err)
          })

        // this.spinner.show();

      } else {

        console.log("checking if user data is in database or not");

        firebase.firestore().collection("doctors")
          .doc(user.uid)
          .get().then((doc) => {
            if (doc.exists) {
              console.log("user already exists");
              this.fullUserData = doc.data();
              console.log(this.fullUserData);
              this.user = user;
              console.log(this.user, "this.user");

              setTimeout(() => {
                this.navService.changeLoadingShowData(false);
              }, 1000);
              this.dataService.changeProfileData(this.fullUserData);

              // Open the user data updation promt dialog for the first time user logs in

              if (this.fullUserData.phoneNo === "" && this.fullUserData.address === "") {
                const dialogRef = this.dialog.open(UpdateProfileDialogComponent, {
                  hasBackdrop: false,
                  width: "580px",
                  height: "650px"
                });

                dialogRef.afterClosed().subscribe(result => {
                  console.log(`Dialog result: ${result}`);
                });
              }

            } else {
              console.log("user does not exists");

              let userData = {
                name: user.providerData[0].displayName,
                doctorId: user.uid,
                email: user.providerData[0].email,
                phoneNo: "",
                gender: "",
                dob: "",
                schedule: {
                  days: [1, 2, 3, 4, 5],
                  maxAppointmentsPerSlot: 4,
                  slots: [
                    {
                      end: "23 April 2021 at 18: 30: 00 UTC + 5: 30",
                      start: "23 April 2021 at 16: 30: 00 UTC + 5: 30"
                    },
                    {
                      end: "28 April 2021 at 14: 00: 00 UTC + 5: 30",
                      start: "28 April 2021 at 13: 00: 00 UTC + 5: 30"
                    }]
                },
                profilePictureUrl: "",
                about: "",
                address: "",
                // operatorId: "",
                landmark: "",
                createdDate: firebase.firestore.Timestamp.now(),
                state: "",
                rating: {
                  noOfRatings: 0,
                  totalRating: 0
                },
                city: "",
                country: "",
                pincode: "",
                docRegistrationNo: "",
                exprience: "",
                patientIds: [],
                status: true,
                specializations: [],
                verified: true
              }
              firebase.firestore().collection("doctors").doc(user.uid).set(userData)
                .then((docRef: any) => {
                  if (docRef) {

                    //creating additional data in document
                    firebase.firestore().collection("doctors").doc(user.uid)
                      .collection("reviews")
                      .add({})

                    firebase.firestore().collection("doctors").doc(user.uid)
                      .collection("verificationDocs")
                      .add({})

                    setTimeout(() => {
                      this.navService.changeLoadingShowData(false);
                    }, 1000);
                    this.fullUserData = userData;
                    console.log(this.fullUserData);
                    this.dataService.changeProfileData(this.fullUserData);

                    this.router.navigate(['profile-update']);
                  } else {
                    setTimeout(() => {
                      this.navService.changeLoadingShowData(false);
                    }, 1000);
                    console.log(docRef);
                  }
                  console.log("New Document created with ID: ", docRef.id);
                })
                .catch((error) => {
                  console.error("Error adding document: ", error);
                });
              console.log(doc.data());
            }
          })

      }

      console.log(user.providerData);

    } else {
      this.router.navigate(['hospital']);
    }

    this.navService.changeNavShowData(true);
    this.navService.changeToggleData(true);
  }

  ngOnInit(): void {
    this.breakpointObserver.observe('(max-width: 599px)').subscribe((result) => {
      if (result.matches) {
        this.navService.changeToggleData(false);
        this.breakpointFlag = true;
      } else {
        this.navService.changeToggleData(true);
        this.breakpointFlag = false;
      }
    });

    this.getAllAppointments();
  }

  getAllAppointments() {
    firebase.firestore().collection('appointments')
      .where("doctorId", "==", firebase.auth().currentUser.uid)
      .orderBy('dateUpdated', 'desc')
      .get()
      .then((querySnapshot) => {
        console.log("Appointments data here");
        querySnapshot.forEach((doc) => {
          console.log(doc.id, " => ", doc.data());
        })
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
  }

  // events
  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public lineChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], hideInLegendAndTooltip: false }
  ];
  public lineChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      yAxes: [{
        gridLines: {
          display: false
        },
        ticks: {
          display: false
        }
      }],
      xAxes: [{
        gridLines: {
          display: false
        },
        ticks: {
          display: false
        }
      }]
    }
  }

  public lineChartColors: Color[] = [
    { // Theme
      backgroundColor: 'rgb(20, 126, 251,0.5)',
      borderColor: 'rgb(20, 126, 251)'
    }
  ];
  public lineChartLegend = false;
  public lineChartType: ChartType = 'line';
  // public lineChartPlugins = [pluginAnnotations];

  @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;

  onOpenClose() {
    this.triggerOpenClose = this.triggerOpenClose === "open" ? "close" : "open";
  }

  onChatOpen() {
    this.openChatFlag = !this.openChatFlag;
  }

  onChatClose($event) {
    this.openChatFlag = $event;
  }

  options: AnimationOptions = {
    path: '/assets/messenger.json',
    loop: true,
    autoplay: false,
    name: 'messengerAnime'
  };

  options2: AnimationOptions = {
    path: '/assets/10298-calendar.json',
    loop: false,
    autoplay: true
  };

  styles: Partial<CSSStyleDeclaration> = {
    // width: '250px',
    // height: '250px'
  };

  styles2: Partial<CSSStyleDeclaration> = {
    width: '200px',
    height: '200px'
  };

  animationCreated(animationItem: AnimationItem): void {
    console.log(animationItem);
  }

  handleAnimation(anime: any) {
    console.log(anime);
    this.animeMessengerRef = anime;
  }

  onAnimeStart() {
    this.animeMessengerRef.play();
  }

  onSignOut() {
    this.authService.signOut();
  }

  onAnimeStop() {
    this.animeMessengerRef.stop();
  }

  onUpdate() {
    console.log("update the profile");
  }

  resendVerification() {
    this.user.sendEmailVerification();
  }


  onSingOut() {
    firebase.auth().signOut();
    this.router.navigate(['login']);
  }

}
