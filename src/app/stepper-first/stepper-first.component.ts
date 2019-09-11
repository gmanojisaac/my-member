import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-stepper-first',
  templateUrl: './stepper-first.component.html',
  styleUrls: ['./stepper-first.component.css']
})
export class StepperFirstComponent implements OnInit {
  @ViewChild('video', {static: true}) video;
  @ViewChild('picture', {static: false}) picture;
  @ViewChild('canvas', {static: false}) canvas;
  blur: boolean;
  sepia: boolean;
  invert: boolean;
  flip: boolean;
  videoElement: HTMLVideoElement;
  labels = {hello: 'world'};
  generatedImage: any;

  constructor(db: AngularFirestore, private storage: AngularFireStorage){

  }
  
  ngOnInit() {
    this.videoElement = this.video.nativeElement;

    navigator.mediaDevices
      .getUserMedia({
        video: {   width: 200, height: 200, facingMode: 'user', aspectRatio: .5 }
      })
      .then(stream => {
        this.videoElement.srcObject = stream;
      });
    }

  takePicture() {
    const canvasElement = this.canvas.nativeElement;
    const context = canvasElement.getContext('2d');
    context.drawImage(this.videoElement, 0, 0, 200, 200);
    const dataUrl = canvasElement.toDataURL('image/jpeg', 1.0);
    console.log('wat we got here is', dataUrl);
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
      text += possibleText.charAt(Math.floor(Math.random() *    possibleText.length) );
    }
    // Replace extension according to your media type like this 
    const imageName = date + '.' + text + '.jpeg';
    const imageFile = new File([blob], imageName, { type: 'image/jpeg' });
    //this.generatedImage =  window.URL.createObjectURL(imageFile);
     // window.open(this.generatedImage);
     this.storage.upload("filePath", imageFile);
  }

 

  getStyles() {
    let filter = '';
    let transform = '';

    if (this.blur) {
      filter += 'blur(5px)';
    }
    if (this.sepia) {
      filter += 'sepia(50%)';
    }
    if (this.invert) {
      filter += 'invert(1)';
    }
    if (this.flip) {
      transform += 'scaleX(-1)';
    }

    return {
      filter,
      transform,
    };
  

  
  }
}
