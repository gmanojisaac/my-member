import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StepperFirstComponent } from './stepper-first.component';

describe('StepperFirstComponent', () => {
  let component: StepperFirstComponent;
  let fixture: ComponentFixture<StepperFirstComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StepperFirstComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StepperFirstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
