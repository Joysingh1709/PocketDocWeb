import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FirebaseAuthService } from 'src/app/service/firebase-auth.service';
import firebase from 'firebase/app';
import firestore from 'firebase/app';
import 'firebase/storage';
// import { NgxSpinnerService } from "ngx-spinner";
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
// import { Ng2ImgMaxService } from 'ng2-img-max';
import { MatDialog } from '@angular/material/dialog';
import { ChatService } from 'src/app/service/chat.service';
import { AnimationOptions } from 'ngx-lottie';
import { AnimationItem } from 'lottie-web';
import { chatAnime, exapnButton } from 'src/app/animations/animation';
import { NavToggleService } from 'src/app/service/nav-toggle.service';
import { BreakpointObserver, MediaMatcher } from '@angular/cdk/layout';
import { UpdateProfileDialogComponent } from 'src/app/dialogs/update-profile-dialog/update-profile-dialog.component';

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.css'],
  animations: [
    chatAnime(),
    exapnButton()
  ]
})
export class UserHomeComponent implements OnInit {

  providerData: any = [];
  email: string = "";

  fullUserData: any;

  emailLoader: string = "emailLoader";

  openChatFlag: boolean = false;

  apts: any[] = [];
  doctors: any[] = [];

  triggerOpenClose = "close";

  imgURL = "";
  progress = 0;
  user: any;
  name: any;

  fb = firebase.firestore();

  imgFirst: any;
  imgAfter: any;
  uploadedImage: any;

  animeMessengerRef: any;

  breakpointFlag: boolean = false;
  unsbscribeAppointments: () => void;
  firstAppointmentFetch: boolean = true;

  constructor(private router: Router,
    // private spinner: NgxSpinnerService,
    private authService: FirebaseAuthService,
    private afAuth: AngularFireAuth,
    private breakpointObserver: BreakpointObserver,
    private navService: NavToggleService,
    private cdr: ChangeDetectorRef,
    private dataService: ChatService,
    public dialog: MatDialog,
    // private ng2ImgMax: Ng2ImgMaxService
    ) {

    this.navService.changeLoadingShowData(true);

    var user = firebase.auth().currentUser;
    if (user) {
      console.log("User is : ", user.photoURL);
      if (user.photoURL === "user") {
        this.user = user;
        this.providerData = user.providerData;
        this.email = user.providerData[0].email;
        this.name = user.providerData[0].displayName;
        console.log("email verified ? " + user.emailVerified);

        this.navService.changeNavShowData(true);
        this.navService.changeToggleData(true);

        if (!user.emailVerified) {
          setTimeout(() => {
            this.navService.changeLoadingShowData(false);
          }, 1000);

          console.log("show ngx spinner")
          this.navService.changeEmailLoading(true);

          user.sendEmailVerification()
            .then(res => {
              console.log(res);

              setInterval(() => {
                user.reload();

                if (user.emailVerified) {
                  console.log("email loading closed");
                  this.navService.changeEmailLoading(false);
                  clearInterval();
                  //reload page so that it could fetch the user data again       
                  window.location.reload();
                }
              }, 2000);

              this.navService.changeEmailLoading(true);

            }, err => {
              console.log(err)
            })

        } else {
          console.log("checking if user data is in database or not");

          //get user 
          firebase.firestore().collection("users")
            .doc(user.uid)
            .get().then((doc) => {

              if (doc.exists) {
                console.log("user already exists");
                this.fullUserData = doc.data();

                setTimeout(() => {
                  this.navService.changeLoadingShowData(false);
                  // console.log("Screen LOADING OFF")
                }, 1000);
                this.dataService.changeProfileData(this.fullUserData);

                // Open the user data updation promt dialog for the first time user logs in

                if (this.fullUserData.phoneNo === "" && this.fullUserData.address === "") {
                  const dialogRef = this.dialog.open(UpdateProfileDialogComponent, {
                    hasBackdrop: true,
                    disableClose: true,
                    backdropClass: 'bckdrop',
                    minWidth: this.breakpointFlag ? '100vw' : '',
                    width: this.breakpointFlag ? '100vw' : "580px",
                    height: this.breakpointFlag ? '100vh' : "650px"
                  });

                  dialogRef.afterClosed().subscribe(result => {
                    console.log(`Dialog result: ${result}`);
                  });
                }

                console.log("Document data:", doc.data());
              } else {

                console.log("user does not exists");

                let userData = {
                  name: user.providerData[0].displayName,
                  userId: user.uid,
                  email: user.providerData[0].email,
                  phoneNo: "",
                  gender: "",
                  dob: "",
                  profilePictureUrl: "",
                  address: "",
                  landmark: "",
                  state: "",
                  city: "",
                  country: "",
                  pincode: "",
                  verificationType: "",
                  verificatonDocUrl: "",
                  userCreateTimestamp: firebase.firestore.Timestamp.now()
                }

                firebase.firestore().collection("users").doc(user.uid).set(userData)
                  .then(docRef => {
                    //creating additional data in document

                    console.log("creating additional data in document");

                    firebase.firestore().collection('users').doc(user.uid).collection("medicalHistory").doc().set({
                      url: 'https://firebasestorage.googleapis.com/v0/b/pocketdoc-f1700.appspot.com/o/reports%2FNAMAN-SUKHWANI-Participant-Certificate.pdf?alt=media&token=e87156d3-b171-43cf-9f4e-975ac53dfb52',
                      name: "Sample Report",
                      dateCreated: firebase.firestore.Timestamp.now(),
                      appointments: []
                    }).catch(err => console.log(err))
                    firebase.firestore().collection('users').doc(user.uid).collection("paymentDetails").doc().set({}).catch(err => console.log(err))

                    const dialogRef = this.dialog.open(UpdateProfileDialogComponent, {
                      hasBackdrop: true,
                      disableClose: true,
                      backdropClass: 'bckdrop',
                      minWidth: this.breakpointFlag ? '100vw' : '',
                      width: this.breakpointFlag ? '100vw' : "580px",
                      height: this.breakpointFlag ? '100vh' : "650px"
                    });

                    dialogRef.afterClosed().subscribe(result => {
                      console.log(`Dialog result: ${result}`);
                    });

                    setTimeout(() => {
                      this.navService.changeLoadingShowData(false);
                    }, 1000);

                    this.fullUserData = userData;
                    // console.log(this.fullUserData);
                    this.dataService.changeProfileData(this.fullUserData);

                    // Open the user data updation promt dialog for the first time user logs in

                    console.log("lets open profile update dialog");

                    // this.router.navigate(['profile-update']);
                    // } else {
                    //   setTimeout(() => {
                    //     this.navService.changeLoadingShowData(false);
                    //   }, 1000);
                    //   // console.log(docRef);
                    // }
                    // console.log("New Document created with ID: ", docRef.id);
                    // this.getAllAppointments();
                  })
                  .catch((error) => {
                    console.error("Error adding document: ", error);
                  });

                // doc.data() will be undefined in this case
                // console.log("No such document!");
              }
            }).catch((error) => {
              console.log("Error getting document:", error);
            });
        }

      } else if (user.photoURL === "doctor") {
        this.router.navigate(['doctor']);
      } else {
        this.router.navigate(['operator']);
      }

    } else {
      // User is signed out.
      this.router.navigate(['/login']);
    }
  }

  ngOnInit(): void {
    var user = firebase.auth().currentUser;
    this.breakpointObserver.observe('(max-width: 599px)').subscribe((result) => {
      if (result.matches) {
        this.navService.changeToggleData(false);
        this.breakpointFlag = true;
      } else {
        this.navService.changeToggleData(true);
        this.breakpointFlag = false;
      }
    });
    this.getAllDoctors();

    // fetching all the user appointments

    if (user.photoURL === "user") {

      this.unsbscribeAppointments = firebase.firestore().collection('appointments')
        .where('userId', '==', user.uid)
        .orderBy('time', 'desc')
        .onSnapshot(querySnapshot => {
          return Promise.all(querySnapshot.docs.map(async appointment => {
            return {
              id: appointment.id,
              doctorData: await this.getDoctorData(appointment.data().doctorId),
              ...appointment.data()
            }
          }))
            .then(list => {
              if (this.firstAppointmentFetch) {
                this.firstAppointmentFetch = false;
                this.addAppointments(list);
              }
              else {
                this.updateAppointments(list)
              }
            })
            .catch(err => {
              console.log(err);
            })

        },
          errors => {
            console.log(errors);
          });

    }

  }

  updateAppointments(appointments) {

    const dayStart = new Date()
    dayStart.setHours(0, 0, 0, 0)

    var appointmentsCurrent = appointments.filter((appointment) => {
      return appointment.time.toDate() >= dayStart
    })

    var appointmentsPrevious = appointments.filter((appointment) => {
      return appointment.time.toDate() <= dayStart
    })

    var appointmentsSchduled = appointments.filter((appointment) => {
      return appointment.time.toDate() >= dayStart && (appointment.status == "accepted")
    })
    // settlePreviousPendingAppointments(appointmentsPrevious);
    // dispatch(updateAppointmentsCurrent(appointmentsCurrent))
    // dispatch(updateAppointmentsPrevious(appointmentsPrevious))
    // dispatch(updateAppointmentsSchduled(appointmentsSchduled.reverse()))
    // dispatch(updateAppointmentsAll(appointments))
  }

  addAppointments(appointments) {

    const dayStart = new Date()
    dayStart.setHours(0, 0, 0, 0)

    var appointmentsCurrent = appointments.filter((appointment) => {
      return appointment.time.toDate() >= dayStart
    })

    var appointmentsPrevious = appointments.filter((appointment) => {
      return appointment.time.toDate() <= dayStart
    })

    var appointmentsSchduled = appointments.filter((appointment) => {
      return appointment.time.toDate() >= dayStart && (appointment.status == "accepted")
    })

    // settlePreviousPendingAppointments(appointmentsPrevious);
    // dispatch(addAppointmentsCurrent(appointmentsCurrent.reverse()))
    // dispatch(addAppointmentsPrevious(appointmentsPrevious))
    // dispatch(addAppointmentsSchduled(appointmentsSchduled.reverse()))
    // dispatch(addAppointmentsAll(appointments));
  }

  getDoctorData(uid) {
    return firebase.firestore().collection('doctors').doc(uid).get()
      .then(data => {
        return data.data();
      })
      .catch(err => {
        console.log(err);
      })
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  async getAllDoctors() {
    this.fb.collection("doctors")
      .get()
      .then((querySnap) => {
        console.log("Doctors Data => ")
        querySnap.forEach((doc) => {
          this.doctors.push(doc.data());
          console.log(this.doctors);
        })
      })
  }

  // async getAllAppointments() {
  //   this.fb.collection('appointments')
  //     .where("userId", "==", firebase.auth().currentUser.uid)
  //     .get()
  //     .then((querySnapshot) => {
  //       console.warn("User Appointments data here");
  //       querySnapshot.forEach((doc) => {
  //         console.log(doc.id, " => ", doc.data());
  //         // fetching doctor data
  //         let d = doc.data();

  //         this.fb.collection("doctors").doc(d.doctorId)
  //           .get()
  //           .then(docD => {
  //             let resData = docD.data();
  //             let _pushData = {
  //               doctorName: resData.name,
  //               specializations: resData.specializations,
  //               ...doc.data()
  //             }
  //             this.apts.push(_pushData);
  //           })

  //       })
  //     })
  //     .catch(function (error) {
  //       console.log("Error getting documents: ", error);
  //     });
  // }

  onChatOpen() {
    this.openChatFlag = !this.openChatFlag;
    this.navService.changeToggleData(false);
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

  onAnimeStop() {
    this.animeMessengerRef.stop();
  }

  onUpdate() {
    console.log("update the profile");
  }

  resendVerification() {
    this.user.sendEmailVerification();
  }

  onSignOut() {
    this.unsbscribeAppointments();
    this.authService.signOut();
  }

  addEmoji(event) {
    console.log(event.emoji.native);
  }

  onOpenClose() {
    this.triggerOpenClose = this.triggerOpenClose === "open" ? "close" : "open";
  }

  parseDate(date): string {
    var today = new Date();
    var d = new Date(date.toDate());
    if (d.getDate() == today.getDate()) {
      return (`Today ${d.toLocaleTimeString()}`);
    }
    else {
      return d.toLocaleString().toString();
      // let yr = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
      // let mo = new Intl.DateTimeFormat('en', { month: 'numeric' }).format(d);
      // let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
    }
  }

  // onimageUpload(event) {
  //   const img = event.target.files[0];
  //   console.log(img);

  //   this.ng2ImgMax.resizeImage(img, 400, 400).subscribe(
  //     result => {
  //       console.log(result);
  //       let fr2 = new FileReader();
  //       fr2.onload = () => {
  //         this.imgAfter = fr2.result;
  //       };
  //       fr2.readAsDataURL(result);

  //       // upload resized img on firebase bucket
  //       var metadata = {
  //         contentType: 'image/jpeg'
  //       };

  //       var storageRef = firebase.storage().ref();
  //       var uploadTask = storageRef.child('images/' + result.name).put(result, metadata);

  //       uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, (snapshot) => {
  //         var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  //         console.log('Upload is ' + progress + '% done');
  //         this.progress = progress;

  //       }, (error: any) => {

  //         switch (error.code) {
  //           case 'storage/unauthorized':
  //             // User doesn't have permission to access the object
  //             break;

  //           case 'storage/canceled':
  //             // User canceled the upload
  //             break;

  //           case 'storage/unknown':
  //             // Unknown error occurred, inspect error.serverResponse
  //             break;
  //         }
  //       }, () => {
  //         uploadTask.snapshot.ref.getDownloadURL().then((url) => {
  //           console.log('File available at', url);
  //           this.imgURL = url;
  //         });
  //       });
  //     },
  //     error => {
  //       console.log('😢 Oh no!', error);
  //     }
  //   );

  // }

}
