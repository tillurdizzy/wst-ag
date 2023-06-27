import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent implements OnInit {
  displayDialog = false;
  title: string;
  message: string;

  ngOnInit() {
   console.log(this.message)
  }

  closeDialog() {
    this.displayDialog = false;
  }
}