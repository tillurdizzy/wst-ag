import { Component, OnInit} from '@angular/core';
import { IUnit } from 'src/app/services/interfaces/iuser';
import { IVehicle } from 'src/app/services/interfaces/iuser';
import { Subscription } from 'rxjs'
import { Router } from '@angular/router'
import { IResident, IResidentAccount, IResidentInsert } from 'src/app/services/interfaces/iuser';
import { VehiclesService } from 'src/app/services/vehicles.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.scss']
})
export class VehiclesComponent {
  me = "VehiclesComponent";
  userSubscribe: Subscription;
  myVehicles: IVehicle[] = [{ name: '', tag: '', space: '', make: '', model: '', color: '', unit: 0, link: '', url: '', id: 0, sort: '' }];
  editVehicle: IVehicle = { name: '', tag: '', space: '', make: '', model: '', color: '', unit: 0, link: '', url: '', id: 0, sort: '' };

  private processVehicles(data:any){
    console.log(this.me + '>> processVehicles()')
    if(data == null){return}
    this.myVehicles = data;
    //this.rs.setUnitVehicles(this.myVehicles);
    let x = this.myVehicles.length;
   
  }
  constructor(private vs: VehiclesService, private us: UserService) {

    this.vs.getVehiclesObs().subscribe((x:IVehicle[]) =>  {
      console.log(this.me + '>> getVehiclesObs()')
      if(x.length > 0){
        this.processVehicles(x);
      }
    });
  }
};
