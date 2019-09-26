import { Component, OnInit, HostBinding  } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MemberloadService, config, Task } from '../memberload.service';
import { transition, trigger, query, style, animate, stagger } from '@angular/animations';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
  animations: [
    trigger('pageAnimations', [
      transition(':enter', [
        query('.logo , .viking', [
          style({opacity: 0, transform: 'translateY(-100px)'}),
          stagger(30, [
            animate('500ms cubic-bezier(0.35, 0, 0.25, 1)', style({ opacity: 1, transform: 'none' }))
          ])
        ], { optional: true })
      ]),
      transition(':leave', [
        query(' .logo, .viking', [
          style({opacity: 1, transform: 'none'}),
          stagger(30, [
            animate('500ms cubic-bezier(0.35, 0, 0.25, 1)', style({ opacity: 0, transform: 'translateY(-100px)' }))
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

  constructor(private taskService: MemberloadService) { }

  ngOnInit() {

  }

  NextPage(){
    this.taskService.googleSignin();    
  }

}
