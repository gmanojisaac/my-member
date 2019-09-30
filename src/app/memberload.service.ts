import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  AngularFirestoreDocument,
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore';
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, of, BehaviorSubject } from 'rxjs';
import * as firebase from 'firebase/app';
import { first } from 'rxjs/operators';
import { Subscription} from 'rxjs';

export interface UserInfo {
  AnniversaryDate: string;
  BirthDate: string;
  City: string;
  displayedTitle: string;
  displayName: string;
  email: string;
  myCustomData: string;
  photoURL: string;
  phoneNumber: string;
  GiftsBank: number;
  verifiedemail: boolean;
  Gender: string;
}

export interface UserInfoLogin extends UserInfo {
  NewOrOldUser: boolean;
  uid: string;
}
@Injectable({
  providedIn: 'root'
})
export class MemberloadService {
  subscription: Subscription;
  FirstTimeLogin = false;
  SuccessUid : string;
  userDoc: AngularFirestoreDocument<UserInfo>;
  CheckuserDoc: AngularFirestoreDocument<UserInfo>;
  userDocitem: Observable<UserInfo>;
  user$: Observable<UserInfo>;
  some: UserInfoLogin = {
    AnniversaryDate: 'Update!',
    BirthDate: 'Update!',
    City: 'Your City',
    displayName: 'From Google',
    email: 'From Google',
    myCustomData: 'unknown',
    photoURL: 'From Google',
    phoneNumber: 'Update!',
    GiftsBank: 0,
    NewOrOldUser: false,
    uid: 'UID',
    verifiedemail: true,
    displayedTitle: 'Your preferred Title',
    Gender: 'unknown'
  };

  public myData: BehaviorSubject<UserInfoLogin> = new BehaviorSubject<UserInfoLogin>(this.some);
  currentMessageData = this.myData.asObservable();

  constructor(private db: AngularFirestore, public afAuth: AngularFireAuth, private router: Router) { }

  docExists(uid: string) {
    return this.db.doc(`users/${uid}`).valueChanges().pipe(first()).toPromise();
  }

  async findOrCreate(uid: string, data: UserInfo) {
    const doc = await this.docExists(uid);

    if (doc) {
      await this.db.doc(`users/${uid}`).valueChanges().pipe(first()).subscribe( (success: UserInfo)  => {
        this.some = { NewOrOldUser: false, uid: `${uid}`, ...success} ;
        this.myData.next(this.some);
        this.router.navigate(['/next']);
      });
      return 'doc exists';
    } else {
      await this.db.doc(`users/${uid}`).set(data);
      return 'created new doc';
    }
  }

  googleSignin() {
    const provider = new auth.GoogleAuthProvider();
    this.afAuth.auth.signInWithPopup(provider).then(successLogin => {
      const saveData: UserInfo = {
        AnniversaryDate: 'Update!',
        BirthDate: 'Update!',
        City: 'Your City',
        displayName: successLogin.user.displayName,
        email: successLogin.user.email,
        myCustomData: 'Update!',
        photoURL: successLogin.user.photoURL,
        phoneNumber: successLogin.user.phoneNumber,
        GiftsBank: 0,
        verifiedemail: successLogin.user.emailVerified,
        displayedTitle: 'Your preferred Title',
        Gender: 'unknown'
      };
      this.SuccessUid = successLogin.user.uid;
      this.findOrCreate(successLogin.user.uid, saveData).then(result => {
        if (result === 'doc exists') {
          /*const sendSaveData: UserInfoLogin = {
            NewOrOldUser: false, uid: successLogin.user.uid, ...saveData
          };*/
          //this.myData.next(this.some);
          //this.router.navigate(['/next']);
        } else {
          const sendSaveData: UserInfoLogin = {
            NewOrOldUser: true, uid: successLogin.user.uid, ...saveData
          };
          this.myData.next(sendSaveData);
          this.router.navigate(['/next']);
        }
      });
    });
  }

  openDialogPersonalUpdate(result: any){
    const userRef: AngularFirestoreDocument<UserInfo> = this.db.doc(`users/${ this.SuccessUid}`);
    const data = {
      City: result.city,
      displayName: result.displayName,
      displayedTitle: result.displayedTitle
    };
    return userRef.update(data);
  }

  public updateUserDataLocation(downloadstr, updaterec) {
    const userRef: AngularFirestoreDocument<UserInfo> = this.db.doc(`users/${updaterec.uid}`);
    const data = {
      uid: updaterec.uid,
      email: updaterec.email,
      displayName: updaterec.displayName,
      photoURL: updaterec.photoURL,
      myCustomData: downloadstr
    };
    return userRef.update(data)
  }

  signOut() {
    this.afAuth.auth.signOut().then(success => {
      this.subscription.unsubscribe();
      this.router.navigate(['/first']);
    });
  }
}
