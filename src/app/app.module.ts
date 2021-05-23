import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

//module imports
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgxSpinnerModule } from "ngx-spinner";
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Ng2ImgMaxModule } from 'ng2-img-max';
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
import { ChartsModule } from 'ng2-charts';

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
import { ServiceWorkerModule } from '@angular/service-worker';
import { BookAppointmentComponent } from './components/book-appointment/book-appointment.component';

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
    BookAppointmentComponent
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
    ChartsModule,
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
    MatMenuModule,
    ReactiveFormsModule,
    MatRippleModule,
    MatSelectModule,
    MatDatepickerModule,
    MatStepperModule,
    NgxSpinnerModule,
    FormsModule,
    LottieModule.forRoot({ player: playerFactory }),
    Ng2ImgMaxModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }), // imports firebase/auth, only needed for auth features
  ],
  entryComponents: [UpdateProfileDialogComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [FirebaseAuthService, ChatService],
  bootstrap: [AppComponent]
})
export class AppModule { }
