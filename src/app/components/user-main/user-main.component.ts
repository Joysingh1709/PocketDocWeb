import { BreakpointObserver } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NgProgress } from 'ngx-progressbar';
import { FirebaseAuthService } from 'src/app/service/firebase-auth.service';
import { NavToggleService } from 'src/app/service/nav-toggle.service';
import { WindowScrollService } from 'src/app/service/window-scroll.service';

@Component({
  selector: 'app-user-main',
  templateUrl: './user-main.component.html',
  styleUrls: ['./user-main.component.css']
})
export class UserMainComponent implements OnInit {

  toggle: boolean = false;
  mode: string = "side";

  hasBackdrop = false;
  activeUrl: string;

  constructor(private toggleService: NavToggleService,
    private router: Router,
    private authService: FirebaseAuthService,
    private cdr: ChangeDetectorRef,
    private windowScrollService: WindowScrollService,
    private progress: NgProgress,
    private breakpointObserver: BreakpointObserver) {
    this.toggleService.changeLoadingShowData(true);
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }
  
  ngOnInit(): void {
    this.breakpointObserver.observe('(max-width: 599px)').subscribe((result) => {
      if (result.matches) {
        this.mode = "over";
        this.hasBackdrop = true;
      } else {
        this.mode = "side";
        this.hasBackdrop = false;
      }
    });

    this.toggleService.currentToggle.subscribe((val) => {
      this.toggle = val;
    });
    // this.router.events.subscribe((e) => {
    //   if (e instanceof NavigationEnd) {
    //     this.activeUrl = e.urlAfterRedirects || e.url;
    //     console.log(this.activeUrl);
    //     if (this.activeUrl === '/user') {
    this.router.navigateByUrl('/user/home');
    //     }
    //   }
    // });
  }

  onScrollSide(e) {
    this.windowScrollService.scrollY.next(this.getYPosition(e));
  }

  getYPosition(e: Event): number {
    return (e.target as Element).scrollTop;
  }

  onSignOut() {
    this.authService.signOut().then(() => {
      this.toggleService.changeNavShowData(false);
      this.toggleService.changeToggleData(false);
      this.toggleService.changeEmailLoading(false);
    });
  }

}
