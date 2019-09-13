import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuidoRecPlayComponent } from './auido-rec-play.component';

describe('AuidoRecPlayComponent', () => {
  let component: AuidoRecPlayComponent;
  let fixture: ComponentFixture<AuidoRecPlayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuidoRecPlayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuidoRecPlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
