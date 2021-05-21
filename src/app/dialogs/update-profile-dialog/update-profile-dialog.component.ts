import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as firebase from 'firebase';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-update-profile-dialog',
  templateUrl: './update-profile-dialog.component.html',
  styleUrls: ['./update-profile-dialog.component.css']
})
export class UpdateProfileDialogComponent implements OnInit {

  showAnime: boolean = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  isEditable = true;

  minDate: Date;
  maxDate: Date;

  genderList: string[] = ['Male', 'Female', 'Other'];

  constructor(private _formBuilder: FormBuilder) {
    // Set the minimum to January 1st 20 years in the past and December 31st a year in the future.
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 20, 0, 1);
    this.maxDate = new Date(currentYear + 1, 11, 31);
  }

  ngOnInit(): void {


    // var user = firebase.auth().currentUser;
    // var credential = firebase.auth.EmailAuthProvider.credential(
    //   firebase.auth().currentUser.email,
    //   "1234"
    // );

    // firebase.auth().currentUser.reauthenticateWithCredential(credential).then((res) => {
    //   console.log(res);
    // }).catch((err) => console.log("old password is wrong"+err))

    this.showAnime = true;
    this.firstFormGroup = this._formBuilder.group({
      phoneNo: [, Validators.required],
      dob: ['', Validators.required],
      gender: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      country: ['', [Validators.required]],
      pincode: ['', [Validators.required]],
      state: ['', [Validators.required]],
      landmark: ['', [Validators.required]]
    });
  }

  options: AnimationOptions = {
    path: '/assets/10535-blue-man-skeleton.json',
    loop: true
  };

  styles: Partial<CSSStyleDeclaration> = {
    width: '250px',
    height: '250px'
  };

  animationCreated(animationItem: AnimationItem): void {
    console.log(animationItem);
  }

}
