import { Component, OnInit } from '@angular/core';
import { trigger, transition, animate, style, query, group, state, animateChild, stagger } from '@angular/animations';
import { Router, RouterOutlet, NavigationStart } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('routeAnimation', [
      transition('* => intro', [
        style({ position: 'relative' }),
        query(':enter, :leave', [
          style({
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%'
          })
        ], { optional: true }),
        query(':enter', [
          style({left: '-100%'})
         
        ], { optional: true }),
        query(':leave ', animateChild(), { optional: true }),
        group([
          query(':leave', [
            animate('200ms ease-out', style({ left: '100%'}))
          ], { optional: true }),
          query(':enter', [

            animate('3000ms ease-out', style({ left: '0%'}))
          ], { optional: true })
        ]),
        query(':enter', animateChild(), { optional: true }),
      ])
    ])
  ]
})
export class AppComponent  implements OnInit {

    constructor (private _router: Router){

    }
    ngOnInit() {
      
      }

      prepRouteAnimation(outlet: RouterOutlet) {
        return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
      }
    
  }
