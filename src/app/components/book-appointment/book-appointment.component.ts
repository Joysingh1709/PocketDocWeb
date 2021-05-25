import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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

  allDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  appointmentForm: FormGroup;

  selectedTimeSlot: any;
  timeSlots: any;


  constructor(private router: Router,
    private fb: FormBuilder,
    private navandtoggleService: NavToggleService) {
    this.navandtoggleService.changeLoadingShowData(true);
    this.data = this.router.getCurrentNavigation().extras.state;
  }

  ngOnInit(): void {
    this.address = this.data.address + ', ' + (this.data.city === '' ? '' : this.data.city + ', ') + (this.data.state === '' ? '' : this.data.state + ', ') + this.data.pincode + (this.data.landmark === '' ? '' : ', near ' + this.data.landmark);
    console.log(this.address);

    this.appointmentForm = this.fb.group({
      dateCreated: [firebase.firestore.Timestamp.now()],
      dateUpdated: [firebase.firestore.Timestamp.now()],
      doctorId: [this.data.doctorId],
      appointmentDocs: [],
      prescription: [],
      problem: [''],
      status: ['pending'],
      // time: [firebase.firestore.Timestamp.fromDate(new Date(`${this.appointmentDate.toLocaleDateString()} ${this.data.schedule.slots[this.selectedTimeSlot].start.toDate().toLocaleTimeString()}`))],
      type: ['online'],
      userId: [firebase.auth().currentUser.uid]
    });
    this.navandtoggleService.changeLoadingShowData(false);
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
