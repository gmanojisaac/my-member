import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
@Component({
  selector: 'app-photopage',
  templateUrl: './photopage.component.html',
  styleUrls: ['./photopage.component.css']
})
export class PhotopageComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }
  NextPage(){
    this.router.navigate(['/second']);
  }
}
