import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StepperDetailsComponent } from './stepper-details/stepper-details.component';
import { StepperFirstComponent } from './stepper-first/stepper-first.component';
import { FirstpageComponent } from './firstpage/firstpage.component';
import { PhotopageComponent } from './photopage/photopage.component';
import { GiftpageComponent } from './giftpage/giftpage.component';
import { AuidoRecPlayComponent } from './auido-rec-play/auido-rec-play.component';
import { VideoRecPlayComponent } from './video-rec-play/video-rec-play.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { SecondPageComponent } from './second-page/second-page.component';
import {AuthGuard} from './auth.guard';
const routes: Routes = [

    { path: '', redirectTo: '/first', pathMatch: 'full' },
    { path: 'myAV', component: GiftpageComponent, outlet: 'sideAV' },
    { path: 'mycontentDetails', component: StepperDetailsComponent, outlet: 'contentDetails' },
    { path: 'first', component: LoginPageComponent },
    { path: 'next', component: FirstpageComponent,  canActivate: [AuthGuard] },
    { path: 'second', component: SecondPageComponent ,  canActivate: [AuthGuard] },
    { path: 'other', component: SecondPageComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
