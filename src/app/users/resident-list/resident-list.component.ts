import { Component, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-resident-list',
  templateUrl: './resident-list.component.html',
  styleUrls: ['./resident-list.component.scss']
})
export class ResidentListComponent {
  @Input() data = null;
  @Output() sendData: EventEmitter<any> = new EventEmitter<any>();

  sendToParent(id){
    this.sendData.emit(id);
  }
}
