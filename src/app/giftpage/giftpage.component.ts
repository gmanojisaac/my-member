import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-giftpage',
  templateUrl: './giftpage.component.html',
  styleUrls: ['./giftpage.component.css']
})
export class GiftpageComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  todo = [
    'message',
    'card_giftcard',
    'money',
    'attach_money'
  ];

  done = [

  ];

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }
  }
}
