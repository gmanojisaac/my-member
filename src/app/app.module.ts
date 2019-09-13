import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HoldableDirective} from './stepper-first/holdable.directive';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppMaterialModule } from './app-material/app-material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { StepperDetailsComponent } from './stepper-details/stepper-details.component';
import { StepperFirstComponent } from './stepper-first/stepper-first.component';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { FirstpageComponent } from './firstpage/firstpage.component';
import { PhotopageComponent } from './photopage/photopage.component';
import { GiftpageComponent } from './giftpage/giftpage.component';
import { AuidoRecPlayComponent } from './auido-rec-play/auido-rec-play.component';
import { VideoRecPlayComponent } from './video-rec-play/video-rec-play.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { SecondPageComponent } from './second-page/second-page.component';

@NgModule({
  declarations: [
    AppComponent,
    StepperDetailsComponent,
    StepperFirstComponent,
    HoldableDirective,
    FirstpageComponent,
    PhotopageComponent,
    GiftpageComponent,
    AuidoRecPlayComponent,
    VideoRecPlayComponent,
    LoginPageComponent,
    SecondPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AppMaterialModule,
    FlexLayoutModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule,
    AngularFirestoreModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
