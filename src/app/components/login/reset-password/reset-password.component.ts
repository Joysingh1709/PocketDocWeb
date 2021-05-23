import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { fadeIn } from 'src/app/animations/animation';
import { AnimationItem } from 'lottie-web';
import firebase from 'firebase/app';
import { AnimationOptions } from 'ngx-lottie';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { async } from 'rxjs/internal/scheduler/async';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    fadeIn()
  ]
})
export class ResetPasswordComponent implements OnInit {

  loadReset: boolean = false;

  forgetPass: boolean = false;
  animationLoad: boolean = false;
  btnText: string = 'Send Password Reset';
  sentText: string = "No worries..!";
  forgetPassText: string = "Enter your registered email address below, a mail with password reset link will beprovided to you.";

  errorResetEmail: boolean = false;
  errorResetEmailMsg: string = "";

  resetEmail: FormGroup;
  formErrors = {
    "email": ''
  }

  validationMessages = {
    "email": {
      'required': 'Email is required',
      'email': 'Email is Invalid'
    }
  }

  constructor(private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.resetEmail = this.fb.group({
      email: ["", [Validators.required, Validators.email]]
    });

    this.resetEmail.valueChanges.subscribe(() => {
      this.onValueChange();
    });
  }

  onValueChange() {
    if (!this.resetEmail) { return; }

    const formData = this.resetEmail;

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

  options: AnimationOptions = {
    path: '/assets/38143-beertech-check.json',
    loop: false
  };

  styles: Partial<CSSStyleDeclaration> = {
    margin: '20px 0px 20px 0px',
  };

  animationCreated(animationItem: AnimationItem): void {
    console.log(animationItem);
  }

  onResetPassword() {
    if (this.resetEmail.valid) {
      console.log(this.resetEmail.value.email);
      this.forgetPassText = 'An email with Reset password link has been sent to ' + this.resetEmail.value.email + ', Please check email.'
      this.sentText = 'Sent succesfully!';
      this.btnText = "Go to Login";
      this.loadReset = true;

      firebase.auth().sendPasswordResetEmail(this.resetEmail.value.email).then(() => {
        console.log("res started");

        console.log("res stoped");

        setTimeout(() => {
          this.router.navigate(['login']);
        }, 4000);
      })
        .catch((err) => {
          if (err) {
            console.log(err);
            if (err.message === "There is no user record corresponding to this identifier. The user may have been deleted.") {
              console.log("error is user not found");
              this.loadReset = false;
            } else {
            }
          }
        })
      this.animationLoad = !this.animationLoad;

    } else {

    }
  }

  toSignUp() {
    this.router.navigate(['sign-up-user'], { relativeTo: this.route.parent });
  }
}
