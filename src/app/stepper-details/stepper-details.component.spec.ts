import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StepperDetailsComponent } from './stepper-details.component';

describe('StepperDetailsComponent', () => {
  let component: StepperDetailsComponent;
  let fixture: ComponentFixture<StepperDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StepperDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StepperDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
