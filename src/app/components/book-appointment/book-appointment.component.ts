import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
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

  cost: number = 0;

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

  timeSlots: any;
  rating: number;

  btnSelect: string = "online";

  starCount: number = 0;

  fontStyleControl = new FormControl();
  fontStyle?: string;
  daySelected: number;
  breakpointFlag: boolean = false;

  public configSucces: MatSnackBarConfig = {
    panelClass: ['style-snack'],
    duration: 4000,
    horizontalPosition: 'center',
    verticalPosition: 'top'
  };

  constructor(private router: Router,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
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
    this.cost = this.data.fee.online;

    this.appointmentForm = this.fb.group({
      problem: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(240)]],
      time: [new Date(), [Validators.required]],
      selectedTimeSlot: [],
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

    this.appointmentForm.get('time').valueChanges.subscribe((val) => {

      this.allDays.forEach((v, i) => {
        val.getDay() == i ? v.active = true : v.active = false;
      });
    });

    this.navandtoggleService.changeLoadingShowData(false);
  }

  onTypeChange(type: string) {
    this.btnSelect = type;
    console.log(this.data.fee[type]);
    this.cost = this.data.fee[type];
  }

  onSubmit() {
    console.log(this.appointmentForm.valid);
    this.router.navigate(['/user/appointment', firebase.auth().currentUser.uid]);
    if (this.appointmentForm.valid) {
      if (this.data.schedule.days.includes(this.appointmentForm.get("time").value.getDay())) {

        const appointmentData = {
          dateCreated: firebase.firestore.Timestamp.now(),
          dateUpdated: firebase.firestore.Timestamp.now(),
          doctorId: this.data.doctorId,
          appointmentDocs: [],
          prescription: [],
          problem: this.appointmentForm.get("problem").value,
          status: 'pending',
          time: firebase.firestore.Timestamp.fromDate(new Date(`${this.appointmentForm.get("time").value.toLocaleDateString()} ${this.data.schedule.slots[this.appointmentForm.get("selectedTimeSlot").value].start.toDate().toLocaleTimeString()}`)),
          type: this.btnSelect,
          userId: firebase.auth().currentUser.uid
        }

        firebase.firestore().collection('appointments').add(appointmentData)
          .then(value => {
            this.router.navigate(['/user/appointment', value.id]);
          })
          .catch(err => {
            console.log(err);
          })

        console.log(appointmentData);

      }
      else {
        this.openSnackBar(`${this.data.name} is not available on ${this.allDays[this.appointmentForm.get("time").value.getDay()].day}. See available days for booking.`, "Try again");
      }

    }

  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, this.configSucces);
  }

}
