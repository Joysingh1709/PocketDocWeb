import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import { chatWin } from 'src/app/animations/animation';
import { ChatService } from 'src/app/service/chat.service';
import { FirebaseAuthService } from 'src/app/service/firebase-auth.service';

@Component({
  selector: 'app-chat-doc',
  templateUrl: './chat-doc.component.html',
  styleUrls: ['./chat-doc.component.css'],
  animations: [
    chatWin()
  ]
})
export class ChatDocComponent implements OnInit {

  profiles = [];

  alwaysFalse: boolean = false;

  dateToday = new Date();
  dateYesterday = new Date(86400000);

  userPhotoURL: any;
  fullDocData: any;
  userID: any;
  chatOpenFlag: boolean = false;
  chatProfileName: string = "";
  chatProfileImage: string = "";

  chatDataToPass: any;
  chatMessagesToPass: any[] = [];

  @Input() userData: any;
  @Output() messageEvent = new EventEmitter<boolean>();

  constructor(private fireService: FirebaseAuthService,
    private afAuth: AngularFireAuth,
    private db: AngularFirestore,
    private chatService: ChatService,) {
    this.fullDocData = this.userData;
  }

  ngOnInit() {
    this.afAuth.onAuthStateChanged(async (user) => {
      this.userID = user.uid;
      this.userPhotoURL = user.photoURL;
      console.log(this.userID);

      firebase.firestore().collection('chatRooms')
        .where("doctorId", "==", user.uid)
        .orderBy('lastUpdatedDate', 'desc')
        .onSnapshot(querysnapshot => {
          const thread = querysnapshot.docs.map(docSnap => {
            return docSnap.data();
          })
          this.profiles = thread;
          // this.profiles.forEach((ele) => {
          //   console.log(new Date(ele.lastUpdatedDate));
          // })
          console.log(this.profiles);
        })
    });
  }

  onChatSelect(i) {
    this.chatProfileName = this.profiles[i].userName;
    this.chatProfileImage = this.profiles[i].userProfilePicUrl;
    this.chatDataToPass = this.profiles[i];

    firebase.firestore().collection('chatRooms').doc(this.profiles[i].roomId)
      .update({ doctorMessageCount: 0 })
      .then((res) => {
        console.log(res);
      })

      firebase.firestore().collection('chatRooms').doc(this.profiles[i].roomId)
      .collection('messages')
      .orderBy('createdDate', 'asc')
      .onSnapshot(querysnapshot => {
        console.log(querysnapshot.size);
        let thread = querysnapshot.docs.map(docSnap => {
          return docSnap.data();
        })
        this.chatMessagesToPass = thread;
        console.log(this.chatMessagesToPass);
        console.log(this.chatDataToPass);

      })
    this.chatOpenFlag = true;
  }

  onBack() {
    firebase.firestore().collection('chatRooms').doc(this.chatDataToPass.roomId)
      .update({ userMessageCount: 0 })
      .then((res) => {
        console.log(res);
      })
    this.chatOpenFlag = false;
  }

  onClose() {
    this.messageEvent.emit(this.alwaysFalse);
  }

}
