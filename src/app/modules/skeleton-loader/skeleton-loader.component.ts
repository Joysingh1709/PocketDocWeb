import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'skeleton-loader',
  template: `
  <div class="flex">
    <div [ngStyle]="getStyles()" class="skel-loader loader"></div>
    <div *ngIf="content" class="content"></div>
  </div>
  `,
  styleUrls: ['./skeleton-loader.component.css']
})
export class SkeletonLoaderComponent implements OnInit {

  @Input() Cwidth;
  @Input() Cheight;
  @Input() circle: boolean;
  @Input() content: boolean;

  constructor() { }

  ngOnInit(): void {
  }

  getStyles() {
    const myStyles = {
      'width': this.Cwidth ? this.Cwidth : '100%',
      'height': this.Cheight ? this.Cheight : '',
      'border-radius': this.circle ? '50%' : ''
    };
    return myStyles;
  }

}
