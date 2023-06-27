import { Component, EventEmitter, Input, Output  } from '@angular/core';

@Component({
  selector: 'app-vehicle-list',
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.scss']
})
export class VehicleListComponent {
  @Input() data = null;
  @Output() sendData: EventEmitter<any> = new EventEmitter<any>();


  sendToParent(spaceNum){
    this.sendData.emit(spaceNum);
  }
}
