import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appNavItem]'
})
export class NavItemDirective {

  @Input('itemIcon') iconRef: any;
  @Input('itemName') nameRef: any;

  @HostListener('mouseenter') onMouseEnter() {
    // this.el.nativeElement.style.opacity = 0;
    console.log(this.iconRef.nativeElement);
    // console.log(this.nameRef);
    // this.renderer.setStyle(this.iconRef.nativeElement, 'color', '#147EFB');
    // this.renderer.setStyle(this.nameRef.nativeElement, 'color', '#147EFB');
  }

  @HostListener('mouseleave') onMouseLeave() {
    // this.el.nativeElement.style.opacity = 1;
    console.log(this.iconRef.nativeElement);
    // console.log(this.nameRef);
    // this.renderer.setStyle(this.iconRef.nativeElement, 'color', '#333333c5');
    // this.renderer.setStyle(this.nameRef.nativeElement, 'color', '#333333c5');
  }

  constructor(private el: ElementRef,
    private renderer: Renderer2) {
  }

}
