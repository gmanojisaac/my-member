import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MemberloadService, config, Task } from '../memberload.service';

@Component({
  selector: 'app-photopage',
  templateUrl: './photopage.component.html',
  styleUrls: ['./photopage.component.css']
})
export class PhotopageComponent implements OnInit {
  showphoto: string;
  constructor(private router: Router, public taskService: MemberloadService) {
    
   }

  ngOnInit() {
    this.showphoto= this.taskService.getphoto();
  }
  NextPage(){
    this.router.navigate(['/second']);
  }
}
