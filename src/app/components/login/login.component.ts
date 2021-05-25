import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fadeIn } from '../../animations/animation';
import { FirebaseAuthService } from '../../service/firebase-auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Location } from '@angular/common';
import firebase from 'firebase/app';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { NavToggleService } from 'src/app/service/nav-toggle.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [
    fadeIn()
  ]
})

export class LoginComponent implements OnInit {

  registerForm: FormGroup;
  loading: boolean = false;

  errorMessage: string = "";
  successMessage: string = "";

  formErrors = {
    "email": '',
    "password": ''
  }

  validationMessages = {
    "email": {
      'required': 'Email is required',
      'email': 'Email is Invalid'
    },
    "password": {
      'required': 'Password is required',
      'minlength': 'Password must contain minimum 4 characters',
      'maxlength': 'Password must contain maximum 14 characters'
    }
  }

  constructor(public afAuth: AngularFireAuth,
    private authService: FirebaseAuthService,
    private navService: NavToggleService,
    private fb: FormBuilder,
    private location: Location,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router) {
    this.navService.changeLoadingShowData(false);
  }

  ngOnInit(): void {
    let _rel = JSON.parse(sessionStorage.getItem("_rel"));
    if (!_rel) {
      setTimeout(() => {
        let _rel = true;
        sessionStorage.setItem("_rel", JSON.stringify(_rel));
        location.reload();
      }, 1000);
    }

    this.registerForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(14)])
    });

    // this.resetEmail = new FormControl('', [Validators.required, Validators.email]);

    this.registerForm.valueChanges.subscribe(() => {
      this.onValueChange();
    });
  }

  public configSucces: MatSnackBarConfig = {
    panelClass: ['style-snack'],
    duration: 4000,
    horizontalPosition: 'center',
    verticalPosition: 'top'
  };

  hide = true;
  get emailInput() { return this.registerForm.get('email'); }
  get passwordInput() { return this.registerForm.get('password'); }

  onValueChange() {
    if (!this.registerForm) { return; }

    const formData = this.registerForm;

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

  validateAllFormFields(formGroup: FormGroup) {         //{1}
    console.log("validation fn called");
    Object.keys(formGroup.controls).forEach(field => {  //{2}
      const control = formGroup.get(field);             //{3}
      if (control instanceof FormControl) {             //{4}
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {        //{5}
        this.validateAllFormFields(control);            //{6}
      }
    });
  }

  onLogin() {
    if (this.registerForm.valid) {
      this.loading = true;
      console.log(this.registerForm.value);
      this.authService.doLogin(this.registerForm.value)
        .then(res => {
          this.navService.changeLoadingShowData(true);
          this.loading = false;
          console.log(res);
          console.log(firebase.auth().currentUser.photoURL);
          this.errorMessage = "";
          console.log(this.successMessage);

          switch (firebase.auth().currentUser.photoURL) {
            case "user":
              this.router.navigate(['user/home']);
              break;

            case "doctor":
              this.router.navigate(['doctor']);
              break;

            case "hospital":
              this.router.navigate(['operator']);
              break;

            default:
              break;
          }
        }, err => {
          this.loading = false;
          console.log(err);
          this.errorMessage = err.message;
          this.successMessage = "";
          console.log(this.errorMessage);

          if (err.message === "There is no user record corresponding to this identifier. The user may have been deleted.") {
            this.openSnackBar("There is no user record corresponding to this email", "Retry");
          } else if (err.message === "The password is invalid or the user does not have a password.") {
            this.openSnackBar("The password or email is invalid", "Retry");
          }
        })
    } else {
      console.log(this.registerForm.valid);
      // this.validateAllFormFields(this.registerForm);
    }
  }

  passwordReset() {
    this.router.navigate(['reset-password'], { relativeTo: this.route.parent });
  }

  toSignUp() {
    this.router.navigate(['sign-up-user'], { relativeTo: this.route.parent });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, this.configSucces);
  }

}