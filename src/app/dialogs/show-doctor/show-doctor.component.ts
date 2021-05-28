import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StarRatingColor } from 'src/app/components/star-rating/star-rating.component';
import { BreakpointObserver, MediaMatcher } from '@angular/cdk/layout';
import firebase from 'firebase/app';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';

@Component({
  selector: 'app-show-doctor',
  templateUrl: './show-doctor.component.html',
  styleUrls: ['./show-doctor.component.css']
})
export class ShowDoctorComponent implements OnInit {

  public density = 'cosy';

  arr = [1, 2, 3, 4, 5];

  rating: number = 3;
  starCount: number = 5;
  // starColor = "#ffd740";
  starColorP: StarRatingColor = StarRatingColor.primary;
  starColorW: StarRatingColor = StarRatingColor.warn;
  reviews: any[] = [];
  breakpointFlag: boolean = false;

  constructor(private dialogRef: MatDialogRef<ShowDoctorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
    private route: ActivatedRoute,
    private breakpointObserver: BreakpointObserver) { }

  ngOnInit(): void {
    this.breakpointObserver.observe('(max-width: 599px)').subscribe((result) => {
      console.log("Breakpoint Result : ", result)
      if (result.matches) {
        this.breakpointFlag = true;
      } else {
        this.breakpointFlag = false;
      }
    });
    this.rating = Number((this.data.rating.totalRating / this.data.rating.noOfRatings).toFixed());
    this.getAllReviews();
  }

  showIcon(index: number, rating: number) {
    if (rating >= index + 1) {
      return 'star';
    } else {
      return 'star_border';
    }
  }

  onRatingChanged(rating) {
    console.log(rating);
    this.rating = rating;
  }

  getUserData(uid) {
    return firebase.firestore().collection('users').doc(uid).get()
      .then(data => {
        return data.data();
      })
      .catch(err => {
        console.log(err);
      })
  }

  getAllReviews() {
    firebase.firestore().collection('doctors').doc(this.data.doctorId)
      .collection('reviews')
      .orderBy('dateCreated', 'desc')
      .limit(5)
      .get()
      .then(reviews => {
        const tempList = reviews.docs.map(async review => {
          // console.log(review.data());
          this.reviews.push({
            user: await this.getUserData(review.data().userId),
            ...review.data()
          })
          // return {
          //   name: await this.getUserData(review.data().userId),
          //   ...review.data()
          // }
        })
      })
      .catch(err => {
        console.log(err);
      })
  }

  getInitials(name): string {
    var parts = name.split(' ');
    var initials = '';
    for (var i = 0; i < parts.length; i++) {
      if (parts[i].length > 0 && parts[i] !== '') {
        initials += parts[i][0]
      }
    }
    return initials.toUpperCase()
  }

  onBook() {
    this.router.navigate(['/user/book-appointment', this.data.doctorId], { state: this.data }).then(() => {
      this.dialogRef.close();
    });
  }

}
