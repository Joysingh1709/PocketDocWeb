import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatDocBodyComponent } from './chat-doc-body.component';

describe('ChatDocBodyComponent', () => {
  let component: ChatDocBodyComponent;
  let fixture: ComponentFixture<ChatDocBodyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatDocBodyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatDocBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
