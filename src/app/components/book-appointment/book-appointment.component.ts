import { Component, OnInit } from '@angular/core';
import { Router, RouterStateSnapshot } from '@angular/router';

@Component({
  selector: 'app-book-appointment',
  templateUrl: './book-appointment.component.html',
  styleUrls: ['./book-appointment.component.css']
})
export class BookAppointmentComponent implements OnInit {

  doctorId: string = "";

  constructor(private router: Router,
    private route: RouterStateSnapshot) { }

  ngOnInit(): void {
    console.log(this.route);
  }

}
