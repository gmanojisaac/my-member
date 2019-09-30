import { Component, OnInit , Inject, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MemberloadService, UserInfoLogin} from '../memberload.service';
import {MatDialog, MatDialogConfig , MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Subscription} from 'rxjs';
import {FormBuilder, Validators, FormGroup} from '@angular/forms';

@Component({
  selector: 'dialog-overview-example-dialog',
  template: `
  
  <h1 mat-dialog-title>Hi {{displaynamedialog}}</h1>

  <div mat-dialog-content  [formGroup]="profileform">
    <mat-form-field>
      <input matInput type="text"
        placeholder="What is your Displayed Title?"
        formControlName="displayedTitle">
      <button mat-button *ngIf="profileform.get('displayedTitle').value" matSuffix mat-icon-button aria-label="Clear" 
      (click)="profileform.patchValue({'displayedTitle':''}) ">
        <mat-icon>close</mat-icon>
      </button>
    </mat-form-field>

    <mat-form-field>
      <input matInput type="text"
        placeholder="Update Displayed Name"
        formControlName="displayName">
      <button mat-button *ngIf="profileform.get('displayName').value" matSuffix mat-icon-button aria-label="Clear" 
        (click)="profileform.patchValue({'displayName':''}) ">
          <mat-icon>close</mat-icon>
      </button>
    </mat-form-field>

    <mat-form-field>
      <input matInput type="text"
        placeholder="What is your City?"
        formControlName="city">
      <button mat-button *ngIf="profileform.get('city').value" matSuffix mat-icon-button aria-label="Clear" 
        (click)="profileform.patchValue({'city':''}) ">
          <mat-icon>close</mat-icon>
      </button>
    </mat-form-field>
  </div>
  <div mat-dialog-actions>
    <button mat-raised-button color = "warn" (click)="close()" cdkFocusInitial> Close </button>
    <button mat-raised-button color = "primary" (click)="save()"> Save </button>
  </div>`
})
export class DialogOverviewExampleDialog {
  profileform: FormGroup;
  displaynamedialog: string;



  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) {displayedTitle, displayName, City}: UserInfoLogin) {
      this.displaynamedialog = displayName;
      this.profileform = fb.group({
        displayedTitle: [displayedTitle, Validators.required],
        displayName: [displayName, Validators.required],
        city: [City, Validators.required]
    });

    }
    save() {
      this.dialogRef.close(this.profileform.value);
    }
    close() {
      this.dialogRef.close();
    }
  }

@Component({
  selector: 'app-photopage',
  templateUrl: './photopage.component.html',
  styleUrls: ['./photopage.component.css']
})
export class PhotopageComponent implements OnInit, OnDestroy {
  name: string;
  animal : string;
  showphoto: string;
  neworold= false;
  subscription: Subscription;

  UserInfoLocal : UserInfoLogin = {
    AnniversaryDate: '',
    BirthDate: '',
    City: '',
    displayName: '',
    email: '',
    myCustomData: '',
    photoURL: '',
    phoneNumber: '',
    GiftsBank: 0,
    NewOrOldUser: false,
    uid: '',
    verifiedemail : false,
    displayedTitle: '',
    Gender: ''
  };

  constructor(private router: Router, public taskService: MemberloadService, public dialog: MatDialog) {
   }

  ngOnInit() {
    this.subscription = this.taskService.currentMessageData.subscribe(showDetails => {
      this.UserInfoLocal = showDetails;
      this.UserInfoLocal.photoURL= "https://lh4.googleusercontent.com/-DA3f_XH5UaU/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3rdcNlOVoCBHTnZAbLQAihvQngKZ2w/photo.jpg";
      this.UserInfoLocal.AnniversaryDate = "Nov 11";
      this.UserInfoLocal.BirthDate = "Jan 28";
      console.log(this.UserInfoLocal, showDetails );
    });    
  }
  NextPage(){
    this.router.navigate(['/second']);
  }
  openDialogPersonal(): void {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '350px';

    dialogConfig.data = {
      displayedTitle: this.UserInfoLocal.displayedTitle,
      displayName: this.UserInfoLocal.displayName,
      City: this.UserInfoLocal.City
     };

    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if(result != null){
        this.taskService.openDialogPersonalUpdate(result);
      }

    });
  }
  openDialogPicture(){
  }
  openDialogDates(){
  }
  openDialogFamily(){
  }
  openDialogGreeting(){
  }
  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
  }

}

