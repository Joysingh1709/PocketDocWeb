import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { fadeIn } from 'src/app/animations/animation';
import { FirebaseAuthService } from 'src/app/service/firebase-auth.service';
import { MyErrorStateMatcher } from '../sign-up/sign-up.component';
import { NavToggleService } from 'src/app/service/nav-toggle.service';

@Component({
  selector: 'app-doctor-sign-up',
  templateUrl: './doctor-sign-up.component.html',
  styleUrls: ['./doctor-sign-up.component.css']
})
export class DoctorSignUpComponent implements OnInit {


  hidePass = true;
  hideConPass = true;
  load: boolean = false;
  showReEnterError: boolean = false;

  newUserForm: FormGroup;
  confirmPass: string = "";
  confirmPassError: string = "";

  formErrors = {
    "email": '',
    'name': '',
    "password": '',
    'confirmPassword': ''
  }

  validationMessages = {
    "email": {
      'required': 'Email is required',
      'email': 'Email is Invalid'
    },
    'name': {
      'required': 'Name is required'
    },
    "password": {
      'required': 'Password is required',
      'minlength': 'Password must contain minimum 4 characters',
      'maxlength': 'Password must contain maximum 14 characters'
    },
    "confirmPassword": {
      'required': 'Please Re-enter the password',
    }
  }

  matcher = new MyErrorStateMatcher();
  errorMessage: any;
  successMessage: string;

  constructor(private fb: FormBuilder,
    private router: Router,
    private navService: NavToggleService,
    private firebaseService: FirebaseAuthService) {

    this.navService.changeLoadingShowData(false);
    this.navService.changeNavShowData(false);
    this.navService.changeToggleData(false);
  }

  ngOnInit(): void {
    this.newUserForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      name: ["", [Validators.required]],
      password: ["", [Validators.required, Validators.minLength(4), Validators.maxLength(14)]],
      confirmPassword: ["", [Validators.required]]
    }, { validator: this.checkPasswords });

    this.newUserForm.valueChanges.subscribe(() => {
      this.onValueChange();
    });
  }

  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    let pass = group.controls.password.value;
    let confirmPass = group.controls.confirmPassword.value;

    return pass === confirmPass ? null : { notSame: true }
  }

  onValueChange() {
    if (!this.newUserForm) { return; }

    const formData = this.newUserForm;

    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        this.formErrors[field] = ' ';

        const control = formData.get(field);

        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  onRegister() {
    this.load = true;
    console.log(this.newUserForm.valid);
    if (this.newUserForm.valid) {
      console.log(this.newUserForm.value);
      let _type: string = "doctor";
      this.firebaseService.doUserRegister(this.newUserForm.value, _type)
        .then(res => {
          console.log(res);
          if (res) {
            this.router.navigate(['/doctor']);
          } else {
            console.log(res);
          }
        }, err => {
          this.load = false;
          console.log(err);
          this.errorMessage = err.message;
          this.successMessage = "";
          console.log(this.errorMessage);
        })
    } else {
      this.load = false;
      this.checkPasswords(this.newUserForm);
    }
  }
}
