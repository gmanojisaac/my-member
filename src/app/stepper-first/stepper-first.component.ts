import { Component, Directive, OnInit, ViewChild, HostListener, Input } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MemberloadService, config, Task } from '../memberload.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as RecordRTC from 'recordrtc';
import { AngularFireStorage } from '@angular/fire/storage';

@Directive({
  selector: '[draw-text]'
})
export class ImageDrawTextDirective {

  loaded = false;
  @Input() text: string;
  @HostListener('load', ['$event.target'])
  onLoad(img) {
    if (this.loaded) {
      return;
    }
    this.loaded = true;
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    canvas.height = img.height;
    canvas.width = img.width;

    context.drawImage(img, 0, 0);
    img.src = canvas.toDataURL();

  }
}

@Component({
  selector: 'app-stepper-first',
  templateUrl: './stepper-first.component.html',
  styleUrls: ['./stepper-first.component.css']
})
export class StepperFirstComponent implements OnInit {
  tasks: Observable<any[]>;
  image: string;
  myTask: string;
  editMode: boolean = false;
  taskToEdit: any = {};
  @ViewChild('canvas', { static: true }) canvas;
  imageElement: HTMLImageElement;
  @ViewChild('imgelement', { static: true }) imgelement;

  loaded = false;
  constructor(private db: AngularFirestore, private taskService: MemberloadService, public storage: AngularFireStorage) {

  }

  ngOnInit() {
    this.imageElement = this.imgelement.nativeElement;
    this.tasks = this.db.collection(config.collection_endpoint).snapshotChanges().pipe(map((actions) => {
      return actions.map(a => {
        //Get document data
        const data = a.payload.doc.data() as Task;
        //Get document id
        const id = a.payload.doc.id;
        //Use spread operator to add the id to the document data
        return { id, ...data };
      });
    }));
    this.taskService.user$.subscribe((myuser) => {
      if (myuser != null) {
        this.image = myuser.photoURL;
        this.imageElement.src = myuser.photoURL;
        fetch(myuser.photoURL)
          .then((response) => {
            return response.blob();
          })
          .then(blobme => {
            console.log(blobme);
            const date = new Date().valueOf();
            let text = '';
            const possibleText = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            for (let i = 0; i < 5; i++) {
              text += possibleText.charAt(Math.floor(Math.random() * possibleText.length));
            }
            // Replace extension according to your media type like this 
            const imageName = date + '.' + text + '.jpeg';
            const imageFile = new File([blobme], imageName, { type: 'image/jpeg' });
            //this.generatedImage =  window.URL.createObjectURL(imageFile);
            // window.open(this.generatedImage);
            console.log('imageFile', imageFile);
            this.storage.upload('filePath_profile', imageFile);
              /*.then( uploadstat => {
                if( uploadstat != null){
                  uploadstat.ref.getDownloadURL().then(downloadURL=>{
                    //this.taskService.updateUserDataLocation(myuser, downloadURL);
                  });
                }
              });*/
  });

}
      

    });
    /*
    let img = new Image;
    const canvasElement = this.canvas.nativeElement;
    const context = canvasElement.getContext('2d');
    this.taskService.user$.subscribe((myuser) => {
      if (myuser != null) {
        img.addEventListener("load", function () {
          context.drawImage(img, 0, 0, 200, 200);

          const dataUrl = canvasElement.toDataURL('image/jpeg', 1.0);
          const image = atob(dataUrl.split('data:image/jpeg;base64,')[1]);
          const length = image.length;
          const imageBytes = new ArrayBuffer(length);
          const ua = new Uint8Array(imageBytes);
          for (let i = 0; i < length; i++) {
            ua[i] = image.charCodeAt(i);
          }
          const blob = new Blob([ua], { type: 'image/jpeg' });
          const date = new Date().valueOf();
          let text = '';
          const possibleText = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
          for (let i = 0; i < 5; i++) {
            text += possibleText.charAt(Math.floor(Math.random() * possibleText.length));
          }
          // Replace extension according to your media type like this 
          const imageName = date + '.' + text + '.jpeg';
          this.imageFile = new File([blob], imageName, { type: 'image/jpeg' });
          //this.generatedImage =  window.URL.createObjectURL(imageFile);
          // window.open(this.generatedImage);
          //this.storage.upload("filePath_profile", imageFile);
        });
        img.setAttribute("src", myuser.photoURL);
        console.log("img", myuser.photoURL);
      }
    });*/

  }
onImageLoad() {
  if (this.loaded) {
    return;
  }

  this.loaded = true;
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  //canvas.height = img.height;
  //canvas.width = img.width;





}

edit(task) {
  console.log(task);
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
      console.log(task);
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
} //deleteTask



}
