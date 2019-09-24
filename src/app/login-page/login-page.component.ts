import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MemberloadService, config, Task } from '../memberload.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
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
