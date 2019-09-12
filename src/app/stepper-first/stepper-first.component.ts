import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable, fromEvent } from 'rxjs';
import { take, tap, pluck } from 'rxjs/operators';
/* this module starts the video camera and takes a photo and saves in the storage */

export enum RecordingState {
  STOPPED = 'stopped',
  RECORDING = 'recording',
  FORBIDDEN = 'forbidden',
}

@Component({
  selector: 'app-stepper-first',
  templateUrl: './stepper-first.component.html',
  styleUrls: ['./stepper-first.component.css']
})
export class StepperFirstComponent implements OnInit {
  myurl: string;
  @ViewChild('audio', { static: true }) audio;
  audioElement: HTMLAudioElement;
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
  /* NgStyle is written on the template*/
  audioChunks = [];
  mediaRecorder: MediaRecorder;
  state: RecordingState = RecordingState.STOPPED;
  seconds: number;
  private recordings$: Observable<any>;
  constructor(db: AngularFirestore, private storage: AngularFireStorage,  private sanitizer: DomSanitizer, private changeDetector: ChangeDetectorRef) {
    /* upload is the method used for saving the img file to the storage */
  }

  ngOnInit() {
    this.videoElement = this.video.nativeElement;
    this.audioElement = this.audio.nativeElement;
   /* navigator.mediaDevices
      .getUserMedia({
        video: { width: 200, height: 200, facingMode: 'user', aspectRatio: .5 }
      })
      .then(stream => {
        this.videoElement.srcObject = stream;
      });*/


   }
   onHold(time) {
    this.state = RecordingState.RECORDING;
    this.seconds = Math.round(time / 1000);
    console.log(this.seconds);
  }
  recordAudio(){
    navigator.mediaDevices.getUserMedia({ audio: true })
  .then(stream => {
    console.log("Received stream");
    const options = {mimeType: 'audio/webm; codecs=opus'};
    this.mediaRecorder = new MediaRecorder(stream, options);
    this.mediaRecorder.start();
    //this.audioElement.srcObject = stream;
    });
  }

  stoprecord(){
    this.mediaRecorder.stop();
    this.mediaRecorder.onstop = function (event) {

      // POST/PUT "Blob" using FormData/XHR2
      //var blobURL = URL.createObjectURL(blob);
      //const blob = new Blob([this.audioChunks], { type: 'audio/x-mpeg-3' });
        //this.audio.src= this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));   
        //this.audio.play();
      };
   
    this.mediaRecorder.ondataavailable = function(e) {
      const date = new Date().valueOf();
      let text = '';
      const possibleText = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      for (let i = 0; i < 5; i++) {
        text += possibleText.charAt(Math.floor(Math.random() * possibleText.length));
      }
      // Replace extension according to your media type like this 
      const imageName = date + '.' + text + '.webm';
      //var blob = new Blob(e.data, { 'type' : 'audio/webm; codecs=opus' });
      //var audioURL = window.URL.createObjectURL(blob);
      //this.audio.src = audioURL;
      const audioFile = new File([e.data], imageName, { 'type' : 'audio/webm; codecs=opus'  });
      console.log(audioFile);
      //this.generatedImage =  window.URL.createObjectURL(imageFile);
       // window.open(this.generatedImage);
      //this.audioElement.currentSrc= URL.createObjectURL(audioFile);
      this.myurl = window.URL.createObjectURL(audioFile);
      console.log(this.myurl);
    }
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
