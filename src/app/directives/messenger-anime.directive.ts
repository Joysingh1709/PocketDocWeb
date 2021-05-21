import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[MessengerAnime]'
})
export class MessengerAnimeDirective {

  @Input('playStopRefAnime') animeRef: any;

  @HostListener('mouseenter') onMouseEnter() {
    // this.el.nativeElement.style.opacity = 0;
    this.animeRef.play();
  }

  @HostListener('mouseleave') onMouseLeave() {
    // this.el.nativeElement.style.opacity = 1;
    this.animeRef.stop();
  }

  constructor(private el: ElementRef) { 
    console.log(this.animeRef);
  }

}
