import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import firebase from 'firebase';
import { AnimationOptions, LottieComponent } from 'ngx-lottie';

@Component({
  selector: 'app-appointment-view',
  templateUrl: './appointment-view.component.html',
  styleUrls: ['./appointment-view.component.css'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class AppointmentViewComponent implements OnInit {

  data: firebase.firestore.DocumentData;

  userData: firebase.firestore.DocumentData;
  doctorData: firebase.firestore.DocumentData;

  public options: AnimationOptions = {
    path: '/assets/lottie/appointment.json',
    loop: true
  }

  @ViewChild('appointmentLottie') appLottie: LottieComponent;
  @ViewChild('chip') chip: ElementRef;
  appointmentId: any;

  animationCreated(event) {
    console.log(event);
  }

  animationcomplete(event) {
    console.log(this.appLottie);
    // setTimeout(() => {
    //   this.appLottie.containerClass = "animate__animated animate__fadeOutRight";
    //   this.cdr.detectChanges();
    //   setTimeout(() => {
    //     this.chip.nativeElement.className = "animate__animated animate__fadeInRight";
    //     this.cdr.detectChanges();
    //   }, 500);
    // }, 1000);
  }

  constructor(private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.route.params.subscribe(res => {
      this.appointmentId = res.id;
      firebase.firestore().collection("appointments")
        .doc(res.id)
        .get()
        .then(val => {
          this.data = val.data();
          console.log(this.data);

          firebase.firestore().collection("doctors")
            .doc(this.data.doctorId)
            .get()
            .then(res => {
              this.doctorData = res.data();
              console.log(this.doctorData);
            }).catch(err => console.log(err))
        }).catch(err => console.log(err))
    })
  }

}
