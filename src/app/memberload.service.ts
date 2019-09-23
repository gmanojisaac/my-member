import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  AngularFirestoreDocument,
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore';
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export interface User {
  uid: string;
  email: string;
  photoURL?: string;
  displayName?: string;
  myCustomData?: string;
}

export interface Task {
  id: string;
  description: string;
}
export const config = {
  collection_endpoint: 'tasks'
};

@Injectable({
  providedIn: 'root'
})
export class MemberloadService {
  key: string = 'UID';
  keyName: string= 'UserName';
  keyEmail: string= 'UserEmail';
  keyPhoto: string= 'UserPhoto';

  user$: Observable<User>;

  tasks: AngularFirestoreCollection<Task>;
  private taskDoc: AngularFirestoreDocument<Task>;

  constructor(private db: AngularFirestore, private afAuth: AngularFireAuth, private router: Router) { 

    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
          // Logged in

        if (user) {

          return this.db.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          // Logged out if there is no local storage
          
          return of(null);
        }
      })
    )
    this.tasks = db.collection<Task>(config.collection_endpoint);

  }
  async googleSignin() {

      const provider = new auth.GoogleAuthProvider();
      const credential = await this.afAuth.auth.signInWithPopup(provider);
      return;
      //return this.updateUserData(credential.user);
    
  }

  public updateUserDataLocation( updaterec: User, downloadstr: string){

    const userRef: AngularFirestoreDocument<any> = this.db.doc(`users/${updaterec.uid}`);

    const data: User = {
      uid: updaterec.uid,
      email: updaterec.email,
      displayName: updaterec.displayName,
      photoURL: updaterec.photoURL,
      myCustomData: downloadstr

    }

    return userRef.set(data, { merge: true })
  }
  private updateUserData(user) {
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<User> = this.db.doc(`users/${user.uid}`);

    const data = { 
      uid: user.uid, 
      email: user.email, 
      displayName: user.displayName, 
      photoURL: user.photoURL
    } 

    return userRef.set(data, { merge: true });
  }

  async signOut() {
    await this.afAuth.auth.signOut();
    //clear the local storage
    this.router.navigate(['/']);
  }

  addTask(task) {
    //Add the new task to the collection
    this.tasks.add(task);
  } //addTask

  updateTask(id, update) {
    //Get the task document
    this.taskDoc = this.db.doc<Task>(`${config.collection_endpoint}/${id}`);
    this.taskDoc.update(update);
 } //updateTask
 deleteTask(id) {
  //Get the task document
  this.taskDoc = this.db.doc<Task>(`${config.collection_endpoint}/${id}`);
  //Delete the document
  this.taskDoc.delete();
  } //deleteTask
}
