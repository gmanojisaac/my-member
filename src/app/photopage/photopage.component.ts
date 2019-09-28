import { Component, OnInit , Inject} from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MemberloadService} from '../memberload.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'dialog-overview-example-dialog',
  template: `<h1 mat-dialog-title>Hi {{data.name}}</h1>
  <div mat-dialog-content>
    <p>What's your favorite animal?</p>
    <mat-form-field>
      <input matInput [(ngModel)]="data.animal">
    </mat-form-field>
  </div>
  <div mat-dialog-actions>
    <button mat-button (click)="onNoClick()">No Thanks</button>
    <button mat-button [mat-dialog-close]="data.animal" cdkFocusInitial>Ok</button>
  </div>`
})
export class DialogOverviewExampleDialog {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'app-photopage',
  templateUrl: './photopage.component.html',
  styleUrls: ['./photopage.component.css']
})
export class PhotopageComponent implements OnInit {
  name: string;
  animal : string;
  showphoto: string;
  neworold= false;

  constructor(private router: Router, public taskService: MemberloadService, public dialog: MatDialog) {
   }

  ngOnInit() {
    this.taskService.currentMessageData.subscribe(showDetails => {
      this.showphoto = showDetails.photoURL;
      this.neworold =  showDetails.NewOrOldUser;
    });    
  }
  NextPage(){
    this.router.navigate(['/second']);
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '350px',
      data: {name: this.name, animal: this.animal}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.animal = result;
    });
  }

}

