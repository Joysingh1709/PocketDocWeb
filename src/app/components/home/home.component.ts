import { ViewportScroller } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostListener, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';
import { Observable, Subscription } from 'rxjs';
import { fadeIn, winComeGo } from 'src/app/animations/animation';
import { NavToggleService } from 'src/app/service/nav-toggle.service';
import { WindowScrollService } from 'src/app/service/window-scroll.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    fadeIn(),
    winComeGo()
  ]
})
export class HomeComponent implements OnInit {

  offset: number = 0;

  opc: string = "100%";
  marginLeft: string = "";

  sec1Bg: boolean = false;
  sec1InTransformUp: string = "60%";
  showSecIn: boolean = false;

  transformAnime: string = "translate(750px, -200px)";

  pos: number = 750;
  listener: any;
  scrollY$: number;

  private wowSubscription: Subscription;

  // @HostListener('document:scroll', ['$event'])
  // onMousewheel(e: Event) {
  //   console.log(e);
  //   console.debug("Scroll Event : ", window.pageYOffset);
  //   console.log("Page Size : ", window.innerHeight);
  //   window.pageYOffset > window.innerHeight ? this.offset = window.pageYOffset : this.offset = window.pageYOffset;
  // }

  @HostListener('mousewheel', ['$event'])
  checkScrollDirection(event) {
    // console.log(event);
    event.deltaY > 0 ? this.onScroll("up") : this.onScroll("down");
  }

  onScroll(direction: string) {
    console.log(this.offset);
    if (direction === "up") {
      let opacityPer = parseInt(((this.offset / 320) * 100).toFixed(1)) > 100 ? 100 : parseInt(((this.offset / 320) * 100).toFixed(1));
      this.opc = (opacityPer - 100).toFixed().replace('-', '') + "%";
      this.sec1Bg = opacityPer === 100 ? true : false;
      this.transformAnime = "translate(" + (this.pos++) + "px, -200px)"; //"translate("+750 + per.toFixed()+"px, -200px)"
      this.showSecIn = this.offset > 315 ? true : false;
      let oldStyle = {
        transition: "0.5s ease",
        position: "absolute",
        width: "180px",
        height: "180px",
        top: "220px",
        transform: "rotate(270deg)",
        right: "-50px",
        opacity: "1"
      }
      let newStyle = {
        transform: this.offset > 315 ? "translateX(-150%) translateY(-100%) rotate(0deg)" : "rotate(270deg)",
        transition: "0.5s ease",
        position: "absolute",
        width: "180px",
        height: "180px",
        top: "220px",
        opacity: "1"
      }
      this.styles1 = this.offset > 315 ? newStyle : oldStyle;
      console.log(opacityPer);

    } else if (direction === "down") {
      let opacityPer = parseInt(((this.offset / 320) * 100).toFixed(1)) > 100 ? 100 : parseInt(((this.offset / 320) * 100).toFixed(1));
      // let per = parseInt(((this.offset / window.innerHeight) * 100).toFixed(1));
      this.opc = (opacityPer - 100).toFixed().replace('-', '') + "%";
      this.sec1Bg = opacityPer === 100 ? true : false;
      // this.sec1Bg = opacityPer === 100 ? "#FFFFFF !important" : "url(../../../assets/statistic.jpg)";
      this.transformAnime = "translate(" + (this.pos === 750 || this.pos <= 750 ? this.pos : this.pos = this.pos - 2) + "px, -200px)";
      this.showSecIn = this.offset > 315 ? true : false;
      let oldStyle = {
        transition: "0.5s ease",
        position: "absolute",
        width: "180px",
        height: "180px",
        top: "220px",
        transform: "rotate(270deg)",
        right: "-50px",
        opacity: "1"
      }
      let newStyle = {
        transform: this.offset > 315 ? "translateX(-150%) translateY(-100%) rotate(0deg)" : "rotate(270deg)",
        transition: "0.5s ease",
        position: "absolute",
        width: "180px",
        height: "180px",
        top: "220px",
        opacity: "1"
      }
      this.styles1 = this.offset > 315 ? newStyle : oldStyle;

      console.log(opacityPer);
    }
  }

  constructor(private router: Router,
    private windowScrollService: WindowScrollService,
    private navservice: NavToggleService) {
  }

  ngOnInit(): void {
    this.windowScrollService.currentScrollY$.subscribe(val => {
      this.scrollY$ = val;

      this.scrollY$ > window.innerHeight ? this.offset = this.scrollY$ : this.offset = this.scrollY$;
    });

    this.navservice.changeLoadingShowData(false);
  }

  sectionLottie1: AnimationOptions = {
    path: '/assets/2649patient.json',
    loop: true,
    autoplay: true
  };

  options: AnimationOptions = {
    path: '/assets/21474-medical-frontliners.json',
    loop: true
  };

  styles: Partial<CSSStyleDeclaration> = {
    position: "absolute",
    top: "100px",
    right: "150px",
    opacity: "1"
  };

  options1: AnimationOptions = {
    path: '/assets/17578-injection(1).json',
    loop: false
  };

  styles1: Partial<CSSStyleDeclaration> = {
    transition: "0.5s ease",
    position: "absolute",
    width: "180px",
    height: "180px",
    top: "220px",
    transform: "rotate(270deg)",
    right: "-50px",
    opacity: "1"
  };

  animationCreated(animationItem: AnimationItem): void {
    console.log(animationItem);
  }

}
