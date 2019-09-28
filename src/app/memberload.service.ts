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
import { switchMap } from 'rxjs/operators';
import * as firebase from 'firebase/app';
import { first, tap } from 'rxjs/operators';

export interface UserInfo {
  AnniversaryDate: string;
  BirthDate: string;
  City: string;
  displayName: string;
  email: string;
  myCustomData: string;
  photoURL: string;
  phoneNumber: string;
  GiftsBank: number;
}
export interface UserInfoLogin extends UserInfo {
  NewOrOldUser: boolean;
  uid: string;
}
@Injectable({
  providedIn: 'root'
})
export class MemberloadService {
  FirstTimeLogin = false;
  keyPhoto = '';
  userDoc: AngularFirestoreDocument<UserInfo>;
  CheckuserDoc: AngularFirestoreDocument<UserInfo>;
  userDocitem: Observable<UserInfo>;
  user$: Observable<UserInfo>;
  some: UserInfoLogin = {
    AnniversaryDate: '',
    BirthDate: '',
    City: '',
    displayName: 'Manoj Isaac',
    email: 'gmanoj.isaac@gmail.com',
    myCustomData: '',
    photoURL: 'https://lh3.googleusercontent.com/a-/AAuE7mDcM-XfiG-OgprYqulFoAgKDCAvnWSDiiLqiiXx',
    phoneNumber: '',
    GiftsBank: 0,
    NewOrOldUser: false,
    uid: 'KjMfJfNSJzVuV7X5ds8Xu0KUCvG2'
  };

  public myData: BehaviorSubject<UserInfoLogin> = new BehaviorSubject<UserInfoLogin>(this.some);
  currentMessageData = this.myData.asObservable();

  private messageSource = new BehaviorSubject('');
  currentMessage = this.messageSource.asObservable();

  constructor(private db: AngularFirestore, private afAuth: AngularFireAuth, private router: Router) {
    /*
        //First Time User - later
        //RegularUser
        this.user$ = this.afAuth.authState.pipe(
          switchMap(user => {
            // Logged in
            if (user) {
              
              this.userDocitem = this.userDoc.valueChanges();
              this.userDoc = this.db.doc<UserInfo>(`users/${user.uid}`);
              this.userDoc.valueChanges().subscribe(items => {
                if(items != null){
                  this.FirstTimeLogin = true;
                  console.log("First Time");
                  }
                return this.userDoc.valueChanges();
              });
            }
            else {
              // Logged out if there is no local storage
              return of(null);
            }
          })
        );*/
  }

  docExists(uid: string) {

    return this.db.doc(`users/${uid}`).valueChanges().pipe(first()).toPromise();
  }

  async findOrCreate(uid: string, data: UserInfo) {
    const doc = await this.docExists(uid);
    if (doc) {
      return 'doc exists';
    }
    else {
      await this.db.doc(`users/${uid}`).set(data);
      return 'created new doc';
    }
  }

  googleSignin() {
    const provider = new auth.GoogleAuthProvider();
    this.afAuth.auth.signInWithPopup(provider).then(successLogin => {
      this.messageSource.next(successLogin.user.photoURL);
      const saveData: UserInfo = {
        AnniversaryDate: '',
        BirthDate: '',
        City: '',
        displayName: successLogin.user.displayName,
        email: successLogin.user.email,
        myCustomData: '',
        photoURL: successLogin.user.photoURL,
        phoneNumber: successLogin.user.phoneNumber,
        GiftsBank: 0
      };
      this.findOrCreate(successLogin.user.uid, saveData).then(result => {
        if (result === 'doc exists') {
          const sendSaveData: UserInfoLogin = {
            NewOrOldUser: false, uid: successLogin.user.uid, ...saveData
          };
          this.myData.next(sendSaveData);
          this.router.navigate(['/next']);
        }
        else {
          const sendSaveData: UserInfoLogin = {
            NewOrOldUser: true, uid: successLogin.user.uid, ...saveData
          };
          this.myData.next(sendSaveData);
          this.router.navigate(['/next']);
        }

      });
    });
  }
  changeMessage(message: string) {
    this.messageSource.next(message)
  }

  CheckFirstLogin(uid) {
    this.userDoc = this.db.doc<UserInfo>(`users/${uid}`);
    this.userDoc.valueChanges().subscribe(items => {
      if (items != null) {
        this.FirstTimeLogin = true;
      }
    });
  }
  public updateUserDataLocation(downloadstr, updaterec) {
    const userRef: AngularFirestoreDocument<UserInfo> = this.db.doc(`users/${updaterec.uid}`);
    const data = {
      uid: updaterec.uid,
      email: updaterec.email,
      displayName: updaterec.displayName,
      photoURL: updaterec.photoURL,
      myCustomData: downloadstr
    }
    return userRef.update(data)
  }
  getphoto() {
    return this.keyPhoto;
  }
  signOut() {
    this.afAuth.auth.signOut().then(success => {
      this.router.navigate(['/first']);
    });
  }

}
