import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreloaderScreenComponent } from './preloader-screen.component';

describe('PreloaderScreenComponent', () => {
  let component: PreloaderScreenComponent;
  let fixture: ComponentFixture<PreloaderScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreloaderScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreloaderScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
