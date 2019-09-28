import { Component, OnInit, HostBinding  } from '@angular/core';
import { MemberloadService } from '../memberload.service';
import { transition, trigger, query, style, animate, stagger, AnimationEvent  } from '@angular/animations';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
  host: {
    /*
    '[@pageAnimations]': 'someExpression',
    '(@pageAnimations.start)': 'captureStartEvent($event)',
    '(@pageAnimations.done)': 'captureDoneEvent($event)',*/
  },
  animations: [
    trigger('pageAnimations', [
      transition(':enter', [
        query('img', [
          style({opacity: 0, transform: 'translateY(50%)'}),
          stagger('1000ms', [
            animate('500ms cubic-bezier(0.35, 0, 0.25, 1)', style({ opacity: 1, transform: 'none' }))
          ])
        ], { optional: true })
      ]),
      transition(':leave', [
        query('img', [
          style({opacity: 1, transform: 'none'}),
          stagger('30ms', [
            animate('5000ms cubic-bezier(0.35, 0, 0.25, 1)', style({ opacity: 0, transform: 'translateY(50%)' }))
          ])
        ], { optional: true })
      ])
    ]),
  ]
})
@HostBinding('@pageAnimations')
export class LoginPageComponent implements OnInit {
  /*captureStartEvent(event: AnimationEvent) {
    console.log("start",event );
    // the toState, fromState and totalTime data is accessible from the event variable
  }

  captureDoneEvent(event: AnimationEvent) {
    // the toState, fromState and totalTime data is accessible from the event variable
    console.log("End",event );
  }*/
  constructor(public taskService: MemberloadService) { }

  ngOnInit() {

  }

}
