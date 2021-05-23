import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatDocComponent } from './chat-doc.component';

describe('ChatDocComponent', () => {
  let component: ChatDocComponent;
  let fixture: ComponentFixture<ChatDocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatDocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
