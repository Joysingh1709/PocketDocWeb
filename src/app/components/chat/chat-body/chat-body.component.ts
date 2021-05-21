import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import * as firebase from 'firebase';
import { firestore } from 'firebase';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ImagePreviewComponent } from 'src/app/dialogs/image-preview/image-preview.component';
import { ChatService } from 'src/app/service/chat.service';
import { FirebaseAuthService } from 'src/app/service/firebase-auth.service';

export interface Msg {
  body: string,
  createdDate: string,
  mediaUrl: string,
  senderId: string,
  status: boolean,
  type: string
}

@Component({
  selector: 'app-chat-body',
  templateUrl: './chat-body.component.html',
  styleUrls: ['./chat-body.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatBodyComponent implements OnInit {

  inputMessage: string = "";

  messages: any[] = [];

  showEmojis: boolean = false;

  load: boolean = false;

  currentUserData: any;

  newMethodMessages: Observable<any>;

  @Input() chatDataPassed: any;
  @Input('chatMessagesToPassed') chatMessagesToPassed: any[];
  progress: boolean = false;

  constructor(private cdref: ChangeDetectorRef,
    private afAuth: AngularFireAuth,
    private dialog: MatDialog,
    private firebaseService: FirebaseAuthService,
    private db: AngularFirestore,
    private dataService: ChatService) { }

  @ViewChild("textInput") input: ElementRef;

  //animate__animated animate__bounceInUp

  ngOnInit(): void {
    console.log("chat opened");
    console.log(this.chatDataPassed);
    console.log(this.chatDataPassed.roomId);

    // console.log(this.chatMessagesToPassed);

    this.dataService.currentProfileData.subscribe((data) => this.currentUserData = data);

    // firestore().collection('chatRooms').doc(this.chatDataPassed.roomId).collection('messages')
    //   .orderBy('createdDate', 'asc')
    //   .onSnapshot(querysnapshot => {
    //     console.log(querysnapshot.size);
    //     querysnapshot.docChanges().map(docSnap => {
    //       console.log("document data changed");
    //       console.log(docSnap.doc.data());
    //       this.chatMessagesToPassed.concat(docSnap.doc.data());
    //       console.log(this.chatMessagesToPassed);
    //     })
    //   })

    this.db.collection('chatRooms').doc(this.chatDataPassed.roomId).collection('messages')
      .snapshotChanges()
      .pipe(map(snaps => {
        snaps.map(snap => {
          console.log("new method here");
          console.log(snap.payload.doc.data());
          this.chatMessagesToPassed.concat(snap.payload.doc.data());
          // snap.payload.doc.data();
        })
      }))
  }

  addClassToMessages(i): string {

    if (i > 0 && i < this.chatMessagesToPassed.length - 1) {

      // incomming message
      if (this.chatMessagesToPassed[i].senderId !== this.chatDataPassed.userId) {
        if (this.chatMessagesToPassed[i - 1].senderId !== this.chatDataPassed.userId && this.chatMessagesToPassed[i + 1].senderId !== this.chatDataPassed.userId) {
          return 'incoming-message incoming-message-between';
        } else if (this.chatMessagesToPassed[i - 1].senderId !== this.chatDataPassed.userId && this.chatMessagesToPassed[i + 1].senderId === this.chatDataPassed.userId) {
          return 'incoming-message incoming-message-last';
        } else if (this.chatMessagesToPassed[i - 1].senderId === this.chatDataPassed.userId && this.chatMessagesToPassed[i + 1].senderId !== this.chatDataPassed.userId) {
          return 'incoming-message incoming-message-top';
        } else if (this.chatMessagesToPassed[i - 1].senderId === this.chatDataPassed.userId && this.chatMessagesToPassed[i + 1].senderId === this.chatDataPassed.userId) {
          return 'incoming-message incoming-message-new';
        }
      }

      // outgoing message
      if (this.chatMessagesToPassed[i].senderId === this.chatDataPassed.userId) {
        if (this.chatMessagesToPassed[i - 1].senderId === this.chatDataPassed.userId && this.chatMessagesToPassed[i + 1].senderId === this.chatDataPassed.userId) {
          return 'outgoing-message outgoing-message-between';
        } else if (this.chatMessagesToPassed[i - 1].senderId === this.chatDataPassed.userId && this.chatMessagesToPassed[i + 1].senderId !== this.chatDataPassed.userId) {
          return 'outgoing-message outgoing-message-last';
        } else if (this.chatMessagesToPassed[i - 1].senderId !== this.chatDataPassed.userId && this.chatMessagesToPassed[i + 1].senderId === this.chatDataPassed.userId) {
          return 'outgoing-message outgoing-message-top';
        } else if (this.chatMessagesToPassed[i - 1].senderId !== this.chatDataPassed.userId && this.chatMessagesToPassed[i + 1].senderId !== this.chatDataPassed.userId) {
          return 'outgoing-message outgoing-message-new';
        }
      }

      // first message
    } if (i === 0) {
      if (this.chatMessagesToPassed[i].senderId !== this.chatDataPassed.userId) {
        return 'incoming-message incoming-message-new';
      } else if (this.chatMessagesToPassed[i].senderId === this.chatDataPassed.userId) {
        return 'outgoing-message outgoing-message-new';
      }
    }

    // last message
    if (i === this.chatMessagesToPassed.length - 1) {
      if (this.chatMessagesToPassed[i].senderId !== this.chatDataPassed.userId) {
        return 'incoming-message incoming-message-new';
      } else if (this.chatMessagesToPassed[i].senderId === this.chatDataPassed.userId) {
        return 'outgoing-message outgoing-message-new';
      }
    }
  }

  onKeydown(event) {
    event.preventDefault();
  }

  onMsgClick(i) {
    console.log(this.chatMessagesToPassed[i]);

    const dialogRef = this.dialog.open(ImagePreviewComponent, {
      data: {
        imgUrl: this.chatMessagesToPassed[i].mediaUrl
      },
      panelClass: ['dialog-class']
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      console.log(`Dialog result: ${dialogResult}`);
    });
  }

  onMsgTextClick(i) {
    console.log(this.chatMessagesToPassed[i]);
  }

  showEmoji() {
    this.showEmojis = !this.showEmojis;
  }

  addEmoji(event) {
    console.log(event.emoji.native);
    if (event.emoji.native !== null) {
      this.inputMessage += event.emoji.native;
    }
  }

  onImageAdd(event) {
    console.log(event.target.files[0]);

    const file = event.target.files[0];
    const fileName = event.target.files[0].name;

    var fr = new FileReader();

    fr.onload = (e) => {
      console.log(fr.result);
      let imgDataUri = fr.result;

      const dialogRef = this.dialog.open(ImagePreviewComponent, {
        data: {
          imgUrl: imgDataUri
        }
      });

      dialogRef.afterClosed().subscribe(dialogResult => {
        console.log(`Dialog result: ${dialogResult}`);

        if (dialogResult) {
          //image is ready to be sent as a message

          // this.progress = true;
          // upload resized img on firebase bucket
          var metadata = {
            contentType: 'image/jpeg'
          };

          var storageRef = firebase.storage().ref();
          var uploadTask = storageRef.child('imagesChat/' + fileName).put(file, metadata);

          uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, (snapshot) => {
            var progressssss = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progressssss + '% done');

          }, (error: any) => {
            // this.progress = false;

            switch (error.code) {
              case 'storage/unauthorized':
                // User doesn't have permission to access the object
                break;

              case 'storage/canceled':
                // User canceled the upload
                break;

              case 'storage/unknown':
                // Unknown error occurred, inspect error.serverResponse
                break;
            }
          }, () => {
            // this.progress = false; //turning off the loading screen
            uploadTask.snapshot.ref.getDownloadURL().then((url) => {
              // console.log('File available at', url);
              // this.imgURL = url;              

              //image is uploaded successfully and ready to be sent as a message
              this.db.collection('chatRooms')
                .doc(this.chatDataPassed.roomId)
                .collection('messages')
                .add({
                  body: "",
                  createdDate: firestore.Timestamp.fromDate(new Date()),
                  mediaUrl: url,
                  senderId: firebase.auth().currentUser.uid,
                  status: false,
                  type: "image"
                })
                .then((res) => {
                  console.log(res);
                  console.log("message sent succesfully");
                  // this.progress = false;
                  this.db.collection('chatRooms')
                    .doc(this.chatDataPassed.roomId)
                    .update({
                      lastMessage: "📸",
                      lastUpdatedDate: firestore.Timestamp.fromDate(new Date()),
                      userMessageCount: firestore.FieldValue.increment(1)
                    })
                    .then(ress => {
                      console.log(ress);
                    })
                })
              console.log(this.chatMessagesToPassed);
              this.inputMessage = null;
              this.input.nativeElement.value.trim();
              this.progress = false;
            });
          });

        } else {
          // this.progress = false;
          console.log("image canceled");
        }
      });
    }
    fr.readAsDataURL(file);
  }

  onMsgSend() {
    console.log(this.input.nativeElement.value);
    if (this.inputMessage !== "" && this.inputMessage !== null) {
      let msg = this.inputMessage;
      console.log(this.inputMessage);

      this.db.collection('chatRooms')
        .doc(this.chatDataPassed.roomId)
        .collection('messages')
        .add({
          body: this.inputMessage,
          createdDate: firestore.Timestamp.fromDate(new Date()),
          mediaUrl: "",
          senderId: firebase.auth().currentUser.uid,
          status: false,
          type: "text"
        })
        .then((res) => {
          console.log(res);
          console.log("message sent succesfully");
          this.db.collection('chatRooms')
            .doc(this.chatDataPassed.roomId)
            .update({
              lastMessage: msg,
              lastUpdatedDate: firestore.Timestamp.fromDate(new Date()),
              userMessageCount: firestore.FieldValue.increment(1)
            })
            .then(ress => {
              console.log(ress);
            })
        })

      // firestore().collection('chatRooms')
      //   .doc(this.chatDataPassed.roomId)
      //   .collection('messages')
      //   .add({
      //     body: this.inputMessage,
      //     createdDate: firestore.Timestamp.fromDate(new Date()),
      //     mediaUrl: "",
      //     senderId: firebase.auth().currentUser.uid,
      //     status: false,
      //     type: "text"
      //   })
      //   .then((res) => {
      //     console.log(res);
      //     console.log("message sent succesfully");
      //     // this.chatMessagesToPassed.push(mesg);
      //   })
      console.log(this.chatMessagesToPassed);
      this.inputMessage = null;
      this.input.nativeElement.value.trim();
    }
  }

}
