import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import * as RecordRTC from 'recordrtc';

@Component({
  selector: 'app-video-rec-play',
  templateUrl: './video-rec-play.component.html',
  styleUrls: ['./video-rec-play.component.css']
})
export class VideoRecPlayComponent implements OnInit {
  myurl: string;
  @ViewChild('video', { static: true }) video;
  videoElement: HTMLVideoElement;
  /* saved in videoElement type HTMLVideoElement  and methods used were srcObject and used in canvas for display  */
  @ViewChild('picture', { static: false }) picture;
  /* Not used anywhere*/
  @ViewChild('canvas', { static: false }) canvas;
  /* saved in canvasElement and methods used were getContext, toDataURL and used received the blob  */
  blur: boolean;
  sepia: boolean;
  invert: boolean;
  flip: boolean;
  constructor(db: AngularFirestore, private storage: AngularFireStorage) { }

  ngOnInit() {
    this.videoElement = this.video.nativeElement;
    navigator.mediaDevices
       .getUserMedia({
         video: { width: 200, height: 200, facingMode: 'user', aspectRatio: .5 }
       })
       .then(stream => {
         this.videoElement.srcObject = stream;
       });
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
      text += possibleText.charAt(Math.floor(Math.random() * possibleText.length));
    }
    // Replace extension according to your media type like this 
    const imageName = date + '.' + text + '.jpeg';
    const imageFile = new File([blob], imageName, { type: 'image/jpeg' });
    //this.generatedImage =  window.URL.createObjectURL(imageFile);
     // window.open(this.generatedImage);
     this.storage.upload("filePath", imageFile);
  }

}
