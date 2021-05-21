import { BreakpointObserver, MediaMatcher } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { firestore } from 'firebase/app'
import { AnimationItem } from 'lottie-web';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { AnimationOptions } from 'ngx-lottie';
import { NgxSpinnerService } from 'ngx-spinner';
import { chatAnime, exapnButton } from 'src/app/animations/animation';
import { ChatService } from 'src/app/service/chat.service';
import { FirebaseAuthService } from 'src/app/service/firebase-auth.service';
import { NavToggleService } from 'src/app/service/nav-toggle.service';
import * as Chart from 'chart.js';

import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, BaseChartDirective, Label } from 'ng2-charts';
// import * as pluginAnnotations from 'chartjs-plugin-annotation';

@Component({
  selector: 'app-hospital',
  templateUrl: './hospital.component.html',
  styleUrls: ['./hospital.component.css'],
  animations: [
    chatAnime(),
    exapnButton()
  ]
})
export class HospitalComponent implements OnInit {

  providerData: any = [];
  email: string = "";

  fullOperatorData: any;

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
    private spinner: NgxSpinnerService,
    private authService: FirebaseAuthService,
    private afAuth: AngularFireAuth,
    private mediaMatcher: MediaMatcher,
    private breakpointObserver: BreakpointObserver,
    private navService: NavToggleService,
    private dataService: ChatService,
    public dialog: MatDialog,) {

    this.navService.changeLoadingShowData(true);

    console.log(firebase.auth().currentUser.photoURL);
    let role = firebase.auth().currentUser.photoURL;
    if (role === "user") {
      this.router.navigate(['user']);
    } else if (role === "doctor") {

      this.afAuth.onAuthStateChanged(async (user) => {

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
                  this.spinner.hide();
                  clearInterval();
                  //reload page so that it could fetch the user data again
                  window.location.reload();
                }
              }, 2000);

            }, err => {
              console.log(err)
            })

          this.spinner.show();

        } else {

          console.log("checking if user data is in database or not");

          firestore().collection("doctors")
            .doc(user.uid)
            .get().then((doc) => {
              if (doc.exists) {
                console.log("user already exists");
                this.fullUserData = doc.data();
                console.log(this.fullUserData);
                this.user = user;

                setTimeout(() => {
                  this.navService.changeLoadingShowData(false);
                }, 1000);
                this.dataService.changeProfileData(this.fullUserData);

                // Open the user data updation promt dialog for the first time user logs in

                // if (this.fullUserData.phoneNo === "" && this.fullUserData.address === "") {
                //   const dialogRef = this.dialog.open(UpdateProfileDialogComponent, {
                //     hasBackdrop: false,
                //     width: "580px",
                //     height: "650px"
                //   });

                //   dialogRef.afterClosed().subscribe(result => {
                //     console.log(`Dialog result: ${result}`);
                //   });
                // }

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
                firestore().collection("doctors").doc(user.uid).set(userData)
                  .then((docRef: any) => {
                    if (docRef) {

                      //creating additional data in document
                      firestore().collection("doctors").doc(user.uid)
                        .collection("reviews")
                        .add({})

                      firestore().collection("doctors").doc(user.uid)
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

      });

    } else {
      this.router.navigate(['hospital']);
    }

    this.navService.changeNavShowData(true);
    this.navService.changeToggleData(true);
  }

  monthArr: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

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
    var date = new Date();
    var month = date.getMonth();

    this.monthArr.forEach((ele, index) => {
      if (index > month) {
      } else if (index <= month) {
        this.lineChartLabels.push(ele);
      }
    });
  }

  public lineChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' },
    { data: [180, 480, 770, 90, 1000, 270, 400], label: 'Series C', yAxisID: 'y-axis-1' }
  ];
  public lineChartLabels: Label[] = [];
  public lineChartOptions: (ChartOptions & { annotation: any }) = {
    responsive: true,
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      xAxes: [{}],
      yAxes: [
        {
          id: 'y-axis-0',
          position: 'left',
        },
        {
          id: 'y-axis-1',
          position: 'right',
          gridLines: {
            color: 'rgba(255,41,55,0.3)',
          },
          ticks: {
            fontColor: 'red',
          }
        }
      ]
    },
    annotation: {
      annotations: [
        {
          type: 'line',
          mode: 'vertical',
          scaleID: 'x-axis-0',
          value: 'March',
          borderColor: 'orange',
          borderWidth: 2,
          label: {
            enabled: true,
            fontColor: 'orange',
            content: 'LineAnno'
          }
        },
      ],
    },
  };

  public lineChartColors: Color[] = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    { // red
      backgroundColor: 'rgba(255,0,0,0.3)',
      borderColor: 'red',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  public lineChartLegend = true;
  public lineChartType: ChartType = 'line';
  // public lineChartPlugins = [pluginAnnotations];

  @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;

  public randomize(): void {
    for (let i = 0; i < this.lineChartData.length; i++) {
      for (let j = 0; j < this.lineChartData[i].data.length; j++) {
        this.lineChartData[i].data[j] = this.generateNumber(i);
      }
    }
    this.chart.update();
  }

  private generateNumber(i: number): number {
    return Math.floor((Math.random() * (i < 2 ? 100 : 1000)) + 1);
  }

  // events
  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public hideOne(): void {
    const isHidden = this.chart.isDatasetHidden(1);
    this.chart.hideDataset(1, !isHidden);
  }

  public pushOne(): void {
    this.lineChartData.forEach((x, i) => {
      const num = this.generateNumber(i);
      const data: number[] = x.data as number[];
      data.push(num);
    });
    this.lineChartLabels.push(`Label ${this.lineChartLabels.length}`);
  }

  public changeColor(): void {
    this.lineChartColors[2].borderColor = 'green';
    this.lineChartColors[2].backgroundColor = `rgba(0, 255, 0, 0.3)`;
  }

  public changeLabel(): void {
    this.lineChartLabels[2] = ['1st Line', '2nd Line'];
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

}
