import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef,DynamicDialogConfig  } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  providers: [DynamicDialogRef],
})
export class DialogComponent implements OnInit {
  message:string;
  
  ngOnInit() {
    this.message = this.config.data.message;
  }

  constructor(public ref: DynamicDialogRef, public config:DynamicDialogConfig) {}

}
