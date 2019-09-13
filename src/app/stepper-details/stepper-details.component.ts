import { Component, OnInit } from '@angular/core';
import { AnimationBuilder, AnimationPlayer, AnimationMetadata } from '@angular/animations';
import { STEPPER_GLOBAL_OPTIONS, StepperSelectionEvent, CdkStepper } from '@angular/cdk/stepper';;
import { steps } from '../steps';
import { nextStepAnimation } from '../animations/animationsNext';

@Component({
  selector: 'app-stepper-details',
  templateUrl: './stepper-details.component.html',
  styleUrls: ['./stepper-details.component.css'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS,
    useValue: { displayDefaultIndicatorType: false }
  }]
})
export class StepperDetailsComponent implements OnInit {
  public current = 0;
  public steps: any;
  private lastStepIndex = 4;

  constructor(private builder: AnimationBuilder) { }

  public ngOnInit(): void {

    this.steps = steps;
  }

  public onSelChange(e: StepperSelectionEvent) {
    this.current = e.selectedIndex;
  }
  public animateNext(): void {
    if (this.current === this.lastStepIndex) { return; }
    const el = document.getElementById(this.current.toString());

    const player = this.playerFor(nextStepAnimation, el);
    player.play();
  }

  private playerFor(animation: AnimationMetadata, el: Element): AnimationPlayer {
    const factory = this.builder.build(animation);
    return factory.create(el);
  }

}
