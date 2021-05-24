import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { UserHomeComponent } from './components/user-home/user-home.component';

import { AngularFireAuthGuard, redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/auth-guard';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { UpdateProfileComponent } from './components/update-profile/update-profile.component';
import { MainLoginComponent } from './components/login/login/main-login.component';
import { ResetPasswordComponent } from './components/login/reset-password/reset-password.component';
import { HomeComponent } from './components/home/home.component';
import { DoctorHomeComponent } from './components/doctor-home/doctor-home.component';
import firebase from 'firebase';
import { DoctorSignUpComponent } from './components/doctor-sign-up/doctor-sign-up.component';
import { HospitalComponent } from './components/hospital/hospital.component';
import { BookAppointmentComponent } from './components/book-appointment/book-appointment.component';

// const role = firebase.auth().currentUser.photoURL;
const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['/login']);
const redirectLoggedInToIUser = () => redirectLoggedInTo(['user']);

const routes: Routes = [
  {
    path: '', redirectTo: '/login', pathMatch: 'full'
  },
  {
    path: 'pocket-doc', component: HomeComponent,
    data: {
      setAlone: true
    }
  },
  {
    path: 'login', component: MainLoginComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectLoggedInToIUser },
    children: [
      {
        path: 'login-user', component: LoginComponent
      },
      {
        path: 'reset-password', component: ResetPasswordComponent
      },
      {
        path: 'sign-up-user', component: SignUpComponent,
        canActivate: [AngularFireAuthGuard],
        data: { authGuardPipe: redirectLoggedInToIUser }
      },
      {
        path: 'sign-up-doctor', component: DoctorSignUpComponent,
        canActivate: [AngularFireAuthGuard],
        data: { authGuardPipe: redirectLoggedInToIUser }
      }
    ]
  },
  {
    path: 'user',
    component: UserHomeComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin, role: 'user' },
    children: [
      { path: 'profile-update', component: UpdateProfileComponent },
      { path: 'book-Appointment', component: BookAppointmentComponent }
    ]
  },
  {
    path: 'doctor',
    component: DoctorHomeComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin, role: 'doctor' }
  },
  {
    path: 'hospital',
    component: HospitalComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin, role: 'hospital' }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
