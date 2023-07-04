import { Component, OnInit, Input } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';


@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent implements OnInit {
  displayDialog = false;
  @Input() title: string;
  @Input() message: string;

  ngOnInit() {

  }

  closeDialog() {
    this.ref.close();
  }
  constructor(private ref: DynamicDialogRef) { }
}