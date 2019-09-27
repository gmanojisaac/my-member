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
import * as firebase from 'firebase/app';

export class Item {
  name: string;
}

export class GroceryItem {
  value: string;
  id: string;
}


export interface User {
  uid: string;
  email: string;
  photoURL?: string;
  displayName?: string;
  myCustomData?: string;
}

export interface UserDB {
  AnniversaryDate: string;
  BirthDate: string;
  City: string;
  uid: string;
  email: string;
  photoURL: string;
  displayName: string;
  myCustomData: string;
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
  keyPhoto: string= '';

  //user$: Observable<User>;
  user$: Observable<UserDB>;

  tasks: AngularFirestoreCollection<Task>;
  private taskDoc: AngularFirestoreDocument<Task>;
  groceryItemsDoc: AngularFirestoreDocument<Item>;
  groceryItems: Observable<GroceryItem[]>;
  constructor(private db: AngularFirestore, private afAuth: AngularFireAuth, private router: Router) { 
    this.afAuth.auth.onAuthStateChanged(user => {
      if (user) {
        // call method that selects all items when user is authenticated
        this.selectItems(user.uid);
      }
    });

    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
          // Logged in

        if (user) {
          const userRefData: AngularFirestoreDocument<UserDB> = this.db.doc(`users/${user.uid}`);
          return userRefData.collection<Task>('tasks').valueChanges();
          //return this.db.doc<User>(`users/${user.uid}`).valueChanges();
          return this.db.doc<UserDB>(`users/${user.uid}`).valueChanges();
        } else {
          // Logged out if there is no local storage
          
          return of(null);
        }
      })
    )
    this.tasks = db.collection<Task>(config.collection_endpoint);

  }

  getphoto(){
    return this.keyPhoto;
  }

  selectItems(uid: string) {
    this.groceryItemsDoc = this.db.doc<Item>('user/' + uid);
    this.groceryItems = this.groceryItemsDoc.collection<GroceryItem>('GroceryItems').valueChanges();
  }

  googleSignin() {

      const provider = new auth.GoogleAuthProvider();
      this.afAuth.auth.signInWithPopup(provider).then(successLogin =>{
        this.groceryItemsDoc = this.db.doc<Item>('user/' + successLogin.user.uid);
        this.keyPhoto = successLogin.user.photoURL;
        this.router.navigate(['/next']);
      });
  
  }

  public updateUserDataLocation( downloadstr, updaterec){
    
    const userRef: AngularFirestoreDocument<any> = this.db.doc(`users/${updaterec.uid}`);

    const data: User = {
      uid: updaterec.uid,
      email: updaterec.email,
      displayName: updaterec.displayName,
      photoURL: updaterec.photoURL,
      myCustomData: downloadstr

    }

    return userRef.update(data)
  }
  private updateUserData(user) {
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<User> = this.db.doc(`users/${user.uid}`);
    //this.tasks = userRef.collection<Task>('tasks').valueChanges();

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
    this.router.navigate(['/first']);
  }
/*
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
  } //deleteTask*/
}
