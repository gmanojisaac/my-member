import { Component, OnInit } from '@angular/core';
import { MemberloadService } from '../memberload.service';

@Component({
  selector: 'app-firstpage',
  templateUrl: './firstpage.component.html',
  styleUrls: ['./firstpage.component.css']
})
export class FirstpageComponent implements OnInit {

  constructor(public taskService: MemberloadService) { }

  ngOnInit() {
  }

}