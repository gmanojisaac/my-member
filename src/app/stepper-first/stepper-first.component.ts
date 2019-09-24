import { Component, Directive, OnInit, ViewChild, HostListener, Input, ElementRef } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { MemberloadService, config, Task } from '../memberload.service';
import { Observable, Observer } from 'rxjs';
import { map } from 'rxjs/operators';
import * as RecordRTC from 'recordrtc';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-stepper-first',
  templateUrl: './stepper-first.component.html',
  styleUrls: ['./stepper-first.component.css']
})
export class StepperFirstComponent implements OnInit {
  tasks: Observable<any[]>;
  image: string;
  myTask: string;
  editMode = false;
  taskToEdit: any = {};
  /** Template reference to the canvas element */
  @ViewChild('canvas', { static: true }) canvas: ElementRef;
  imageElement: HTMLImageElement;
  @ViewChild('imgelement', { static: false }) imgelement;

  /** Canvas 2d context */
  private context: CanvasRenderingContext2D;

  loaded = false;
  base64Image: any;
  constructor(private db: AngularFirestore, private taskService: MemberloadService, public storage: AngularFireStorage) {

  }

  ngOnInit() {
    /*
    this.tasks = this.db.collection(config.collection_endpoint).snapshotChanges().pipe(map((actions) => {
      return actions.map(a => {
        //Get document data
        const data = a.payload.doc.data() as Task;
        //Get document id
        const id = a.payload.doc.id;
        //Use spread operator to add the id to the document data
        return { id, ...data };
      });
    }));*/
  }

  savephoto(myuser){
    this.getBase64ImageFromURL(myuser.photoURL).subscribe(base64data => {
      this.base64Image = 'data:image/jpg;base64,' + base64data;

      const date = new Date().valueOf();
      let text = '';
      const possibleText = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      for (let i = 0; i < 10; i++) {
        text += possibleText.charAt(Math.floor(Math.random() * possibleText.length));
      }
      // Replace extension according to your media type
      const imageName = date + '.' + text + '.jpeg';
      // call method that creates a blob from dataUri
      const imageBlob = this.dataURItoBlob(base64data);
      const imageFile = new File([imageBlob], imageName, { type: 'image/jpeg' });


      this.storage.upload(`${text}`, imageFile)
      .then(uploadstat => {
        if (uploadstat != null) {
          uploadstat.ref.getDownloadURL().then(downloadURL => {
            this.taskService.updateUserDataLocation(downloadURL, myuser);
          });
        }
      });
    });
  }

  dataURItoBlob(dataURI) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/jpeg' });
    return blob;
  }

  getBase64ImageFromURL(url: string) {
    return new Observable((observer: Observer<string>) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = url;
      if (!img.complete) {
        img.onload = () => {
          observer.next(this.getBase64Image(img));
          observer.complete();
        };
        img.onerror = (err) => {
          observer.error(err);
        };
      } else {
        observer.next(this.getBase64Image(img));
        observer.complete();
      }
    });
  }

  getBase64Image(img: HTMLImageElement) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    var dataURL = canvas.toDataURL("image/png");
    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
  }

/*  edit(task) {

    //Set taskToEdit and editMode
    this.taskToEdit = task;
    this.editMode = true;
    //Set form value
    this.myTask = task.description;
  } //edit

  saveTask() {
    if (this.myTask !== null) {
      //Get the input value
      let task = {
        description: this.myTask
      };
      if (!this.editMode) {
        //console.log(task);
        this.taskService.addTask(task);
      } else {
        //Get the task id
        let taskId = this.taskToEdit.id;
        //update the task
        this.taskService.updateTask(taskId, task);
      }
      //set edit mode to false and clear form
      this.editMode = false;
      this.myTask = '';
    }
  } //saveTask

  deleteTask(task) {
    //Get the task id
    let taskId = task.id;
    //delete the task
    this.taskService.deleteTask(taskId);
  } //deleteTask */



}
