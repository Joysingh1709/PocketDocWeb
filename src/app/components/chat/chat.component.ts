import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import { chatWin } from 'src/app/animations/animation';
import { ChatService } from 'src/app/service/chat.service';
import { FirebaseAuthService } from 'src/app/service/firebase-auth.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  animations: [
    chatWin()
  ]
})
export class ChatComponent implements OnInit {

  profiles = [];

  alwaysFalse: boolean = false;

  dateToday = new Date();
  dateYesterday = new Date(86400000);

  user: any;
  fullUserData: any;
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
    this.fullUserData = this.userData;
  }

  ngOnInit() {
    var user = firebase.auth().currentUser;
    this.userID = user.uid;
    this.user = user.photoURL;
    console.log(this.userID);

    firebase.firestore().collection('chatRooms')
      .where("userId", "==", user.uid)
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
  }

  onChatSelect(i) {
    this.chatProfileName = this.profiles[i].doctorName;
    this.chatProfileImage = this.profiles[i].doctorProfilePicUrl;
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

        // this.chatMessagesToPass.forEach((ele, index) => {

        // });
        // this.load = true;
      })
    this.chatOpenFlag = true;
  }

  onBack() {
    firebase.firestore().collection('chatRooms').doc(this.chatDataToPass.roomId)
      .update({ doctorMessageCount: 0 })
      .then((res) => {
        console.log(res);
      })
    this.chatOpenFlag = false;
  }

  onClose() {
    this.messageEvent.emit(this.alwaysFalse);
  }

}
