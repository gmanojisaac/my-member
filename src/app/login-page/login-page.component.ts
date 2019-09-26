import { Component, OnInit, HostBinding  } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MemberloadService, config, Task } from '../memberload.service';
import { transition, trigger, query, style, animate, stagger, AnimationEvent  } from '@angular/animations';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
  host: {
    '[@pageAnimations]': 'someExpression',
    '(@pageAnimations.start)': 'captureStartEvent($event)',
    '(@pageAnimations.done)': 'captureDoneEvent($event)',
  },
  animations: [
    trigger('pageAnimations', [
      transition(':enter', [
        query('img', [
          style({opacity: 0, transform: 'translateY(200%)'}),
          stagger('1000ms', [
            animate('500ms cubic-bezier(0.35, 0, 0.25, 1)', style({ opacity: 1, transform: 'none' }))
          ])
        ], { optional: true })
      ]),
      transition(':leave', [
        query('img', [
          style({opacity: 1, transform: 'none'}),
          stagger('30ms', [
            animate('5000ms cubic-bezier(0.35, 0, 0.25, 1)', style({ opacity: 0, transform: 'translateY(200%)' }))
          ])
        ], { optional: true })
      ])
    ]),
  ]
})
@HostBinding('@pageAnimations')
export class LoginPageComponent implements OnInit {
  key: string = 'UID';
  keyName: string= 'UserName';
  keyEmail: string= 'UserEmail';
  keyPhoto: string= 'UserPhoto';
  showLogin: boolean;
  showName: string;
  someExpression: any = false;
  captureStartEvent(event: AnimationEvent) {
    console.log("start",event );
    // the toState, fromState and totalTime data is accessible from the event variable
  }

  captureDoneEvent(event: AnimationEvent) {
    // the toState, fromState and totalTime data is accessible from the event variable
    console.log("End",event );
  }
  constructor(private taskService: MemberloadService) { }

  ngOnInit() {

  }

  NextPage(){
    this.taskService.googleSignin();    
  }

}
