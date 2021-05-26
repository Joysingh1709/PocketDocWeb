import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

//module imports
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { LoginComponent } from './components/login/login.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
// import { NgxSpinnerModule } from "ngx-spinner";
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { LottieModule } from 'ngx-lottie';
import player from 'lottie-web';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatDialogModule } from '@angular/material/dialog';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatBadgeModule } from '@angular/material/badge';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { MatMenuModule } from '@angular/material/menu';
import { NgProgressModule } from 'ngx-progressbar';
import { MatRippleModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { LayoutModule } from '@angular/cdk/layout';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { IgxAvatarModule } from "igniteui-angular";
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

import {
  IgxFilterModule,
  IgxDividerModule,
  IgxIconModule,
  IgxListModule,
  IgxInputGroupModule,
  IgxButtonGroupModule
} from "igniteui-angular";

//componets imports
import { UserHomeComponent } from './components/user-home/user-home.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { EmailVerifyComponent } from './dialogs/email-verify/email-verify.component';
import { UpdateProfileComponent } from './components/update-profile/update-profile.component';
import { ResetPasswordComponent } from './components/login/reset-password/reset-password.component';
import { MainLoginComponent } from './components/login/login/main-login.component';
import { ChatComponent } from './components/chat/chat.component';
import { ChatBodyComponent } from './components/chat/chat-body/chat-body.component';
import { HomeComponent } from './components/home/home.component';
import { UpdateProfileDialogComponent } from './dialogs/update-profile-dialog/update-profile-dialog.component';
import { DoctorHomeComponent } from './components/doctor-home/doctor-home.component';
import { FirebaseAuthService } from './service/firebase-auth.service';
import { ChatService } from './service/chat.service';
import { AppointmentsDataService } from './service/appointmentsData.service';
import { ImagePreviewComponent } from './dialogs/image-preview/image-preview.component';
import { MatNativeDateModule } from '@angular/material/core';
import { MessengerAnimeDirective } from './directives/messenger-anime.directive';
import { ProfileNavComponent } from './components/profile-nav/profile-nav.component';
import { DoctorSignUpComponent } from './components/doctor-sign-up/doctor-sign-up.component';
import { PreloaderScreenComponent } from './loading/preloader-screen/preloader-screen.component';
import { NavItemDirective } from './directives/nav-item.directive';
import { ChatDocComponent } from './components/chat-doc/chat-doc.component';
import { ChatDocBodyComponent } from './components/chat-doc/chat-doc-body/chat-doc-body.component';
import { HospitalComponent } from './components/hospital/hospital.component';
import { BookAppointmentComponent } from './components/book-appointment/book-appointment.component';
import { SkeletonLoaderModule } from './modules/skeleton-loader/skeleton-loader.module';
import { ShowDoctorComponent } from './dialogs/show-doctor/show-doctor.component';
import { StarRatingComponent } from './components/star-rating/star-rating.component';
import { UserMainComponent } from './components/user-main/user-main.component';

export function playerFactory() {
  return player;
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UserHomeComponent,
    SignUpComponent,
    EmailVerifyComponent,
    UpdateProfileComponent,
    MainLoginComponent,
    ResetPasswordComponent,
    ChatComponent,
    ChatBodyComponent,
    HomeComponent,
    UpdateProfileDialogComponent,
    DoctorHomeComponent,
    ImagePreviewComponent,
    MessengerAnimeDirective,
    ProfileNavComponent,
    DoctorSignUpComponent,
    PreloaderScreenComponent,
    NavItemDirective,
    ChatDocComponent,
    ChatDocBodyComponent,
    HospitalComponent,
    BookAppointmentComponent,
    ShowDoctorComponent,
    StarRatingComponent,
    UserMainComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatFormFieldModule,
    MatBadgeModule,
    MatIconModule,
    MatSidenavModule,
    MatButtonModule,
    MatCardModule,
    MatListModule,
    MatChipsModule,
    MatTooltipModule,
    MatCheckboxModule,
    HttpClientModule,
    ScrollingModule,
    MatExpansionModule,
    MatDialogModule,
    PickerModule,
    MatDividerModule,
    LayoutModule,
    MatNativeDateModule,
    IgxFilterModule,
    MatButtonToggleModule,
    IgxIconModule,
    IgxListModule,
    IgxInputGroupModule,
    IgxButtonGroupModule,
    IgxDividerModule,
    MatMenuModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatRippleModule,
    MatSelectModule,
    MatDatepickerModule,
    MatStepperModule,
    NgProgressModule,
    SkeletonLoaderModule,
    IgxAvatarModule,
    // NgxSpinnerModule,
    FormsModule,
    LottieModule.forRoot({ player: playerFactory }),
    MatSnackBarModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  entryComponents: [UpdateProfileDialogComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    FirebaseAuthService,
    ChatService,
    AppointmentsDataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
