import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import firebase from 'firebase/app';
import { NavToggleService } from 'src/app/service/nav-toggle.service';

@Component({
  selector: 'app-book-appointment',
  templateUrl: './book-appointment.component.html',
  styleUrls: ['./book-appointment.component.css']
})
export class BookAppointmentComponent implements OnInit {

  data: any;
  address: string;
  appointmentDate = new Date();

  minDate: Date = new Date();
  maxDate: Date;

  allDays = [
    { day: "SUN", active: false },
    { day: "MON", active: false },
    { day: "TUE", active: false },
    { day: "WED", active: false },
    { day: "THU", active: false },
    { day: "FRI", active: false },
    { day: "SAT", active: false }
  ];
  date14days = new Date().getDate() + 14;

  appointmentForm: FormGroup;

  selectedTimeSlot: any;
  timeSlots: any;
  rating: number;

  starCount: number = 5;

  fontStyleControl = new FormControl();
  fontStyle?: string;
  daySelected: number;
  breakpointFlag: boolean = false;


  constructor(private router: Router,
    private fb: FormBuilder,
    private breakpointObserver: BreakpointObserver,
    private navandtoggleService: NavToggleService) {
    this.navandtoggleService.changeLoadingShowData(true);
    this.data = this.router.getCurrentNavigation().extras.state;
    var date = new Date();
    date.setDate(date.getDate() + 13);
    this.maxDate = new Date(date);

    this.allDays.forEach((v, i) => {
      new Date().getDay() == i ? v.active = true : v.active = false;
    });
  }

  myFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    return this.data.schedule.days.includes(day);
  }

  ngOnInit(): void {
    console.log(this.data);
    this.rating = Number((this.data.rating.totalRating / this.data.rating.noOfRatings).toFixed());
    this.address = this.data.address + ', ' + (this.data.city === '' ? '' : this.data.city + ', ') + (this.data.state === '' ? '' : this.data.state + ', ') + this.data.pincode + (this.data.landmark === '' ? '' : ', near ' + this.data.landmark);

    this.appointmentForm = this.fb.group({
      dateCreated: [firebase.firestore.Timestamp.now()],
      dateUpdated: [firebase.firestore.Timestamp.now()],
      doctorId: [this.data.doctorId],
      appointmentDocs: [],
      prescription: [],
      problem: [''],
      status: ['pending'],
      date: [new Date(), [Validators.required]],
      // time: [firebase.firestore.Timestamp.fromDate(new Date(`${this.appointmentDate.toLocaleDateString()} ${this.data.schedule.slots[this.selectedTimeSlot].start.toDate().toLocaleTimeString()}`))],
      type: ['online'],
      userId: [firebase.auth().currentUser.uid]
    });

    this.breakpointObserver.observe('(max-width: 599px)').subscribe((result) => {
      console.log("Breakpoint Result : ", result)
      if (result.matches) {
        this.breakpointFlag = true;
      } else {
        this.breakpointFlag = false;
      }
    });

    this.appointmentForm.get('date').valueChanges.subscribe((val) => {

      this.allDays.forEach((v, i) => {
        val.getDay() == i ? v.active = true : v.active = false;
      });
    });

    this.navandtoggleService.changeLoadingShowData(false);
  }


  onRatingChanged(rt) {
    console.log(rt);
  }

  // bookAppointment() {
  //   if (this.data.schedule.days.includes(this.appointmentDate.getDay())) {
  //     if (yourProblem.length === 0 || yourProblem.length > 240) {
  //       setyourProblemError(true)
  //       return;
  //     }

  //     setinBooking(true)

  //     const appointmentData = {
  //       dateCreated: firestore.Timestamp.now(),
  //       dateUpdated: firestore.Timestamp.now(),
  //       doctorId: data.doctorId,
  //       appointmentDocs: [],
  //       prescription: [],
  //       problem: yourProblem,
  //       status: 'pending',
  //       time: firestore.Timestamp.fromDate(new Date(`${appointmentDate.toLocaleDateString()} ${data.schedule.slots[selectedTimeSlot].start.toDate().toLocaleTimeString()}`)),
  //       type: appointmentMode,
  //       userId: auth().currentUser.uid
  //     }

  //     firestore().collection('appointments').add(appointmentData)
  //       .then(value => {
  //         setbookedAppointmentId(value.id);

  //         setinBooking(false);
  //         setbooked(true);
  //       })
  //       .catch(err => {
  //         console.log(err);
  //         setinBooking(false)
  //         ToastAndroid.show("Unable to book appointment at the moment due to some err");
  //       })

  //   }
  //   else {
  //     console.log(`${data.name} is not available on ${allDays[appointmentDate.getDay()]}. See available days for booking.`);
  //   }

  // }

}
