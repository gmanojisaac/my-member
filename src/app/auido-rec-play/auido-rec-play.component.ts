import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable, fromEvent } from 'rxjs';
import { take, tap, pluck } from 'rxjs/operators';
import * as RecordRTC from 'recordrtc';
/* this module starts the audio and takes a webm clip and saves in the storage */

export enum RecordingState {
  STOPPED = 'stopped',
  RECORDING = 'recording',
  FORBIDDEN = 'forbidden',
}

@Component({
  selector: 'app-auido-rec-play',
  templateUrl: './auido-rec-play.component.html',
  styleUrls: ['./auido-rec-play.component.css']
})
export class AuidoRecPlayComponent implements OnInit {
  state: RecordingState = RecordingState.STOPPED;
  seconds: number;

  //Will use this flag for detect recording
  private recording = false;

  //Lets initiate Record OBJ
  private record;

  private error;
  private url;

  constructor(db: AngularFirestore, private storage: AngularFireStorage,  private sanitizer: DomSanitizer) { }

  ngOnInit() {
  }
  onHold(time) {
    this.state = RecordingState.RECORDING;
    this.seconds = Math.round(time / 1000);
  }
  successCallback(stream) {
    var options = {
        mimeType: "audio/wav",
        numberOfAudioChannels: 1
    };
    //Start Actuall Recording
    var StereoAudioRecorder = RecordRTC.StereoAudioRecorder;
    this.record = new StereoAudioRecorder(stream, options);
    this.record.record();
  }
  errorCallback(error) {
    this.error = 'Can not play audio in your browser';
  }
  initiateRecording() {
        
    this.recording = true;
    let mediaConstraints = {
        video: false,
        audio: true
    };
    navigator.mediaDevices
        .getUserMedia(mediaConstraints)
        .then(this.successCallback.bind(this), this.errorCallback.bind(this));
  }
/*            stop Recording */
  processRecording(blob) {
    this.url = URL.createObjectURL(blob);
    const date = new Date().valueOf();
    let text = '';
    const possibleText = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 5; i++) {
      text += possibleText.charAt(Math.floor(Math.random() * possibleText.length));
    }
    const imageName = date + '.' + text + '.webm';
    const audioFile = new File([blob], imageName, { 'type' : 'audio/webm; codecs=opus'  });
    this.storage.upload("AudiofilePath", audioFile);
  }

  stopRecording() {
    this.recording = false;
    this.state = RecordingState.STOPPED;
    this.record.stop(this.processRecording.bind(this));
  }

  sanitize(url:string){
    return this.sanitizer.bypassSecurityTrustUrl(url);
}


}
