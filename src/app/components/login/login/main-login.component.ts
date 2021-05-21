import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { fadeIn } from 'src/app/animations/animation';

@Component({
  selector: 'app-main-login',
  templateUrl: './main-login.component.html',
  styleUrls: ['./main-login.component.css'],
  animations: [
    fadeIn()
  ]
})
export class MainLoginComponent implements OnInit {
  activeUrl: string;

  constructor(private router: Router) {
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.activeUrl = e.urlAfterRedirects || e.url;
        if (this.activeUrl === '/login') {
          this.router.navigateByUrl('/login/login-user');
        }
      }
    });
  }

  ngOnInit(): void {
  }

}
