import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoRecPlayComponent } from './video-rec-play.component';

describe('VideoRecPlayComponent', () => {
  let component: VideoRecPlayComponent;
  let fixture: ComponentFixture<VideoRecPlayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoRecPlayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoRecPlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
