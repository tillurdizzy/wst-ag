import { Component, OnInit} from '@angular/core';
import { IUnit } from 'src/app/services/interfaces/iuser';
import { IVehicle } from 'src/app/services/interfaces/iuser';
import { Subscription } from 'rxjs'
import { Router } from '@angular/router'
import { IResident, IResidentAccount, IResidentInsert } from 'src/app/services/interfaces/iuser';
import { FormsService } from 'src/app/services/forms.service';
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
    this.fs.setUnitVehicles(this.myVehicles);
    let x = this.myVehicles.length;
    /* if (x == 3) {
      this.vehicleHiddenState = {vehicleOne:true,vehicleTwo:true,vehicleThree:true}
    } else if (x == 2) {
      this.vehicleHiddenState = {vehicleOne:true,vehicleTwo:true,vehicleThree:false}
    } else if (x == 1) {
      this.vehicleHiddenState = {vehicleOne:true,vehicleTwo:false,vehicleThree:false}
    } else if (x == 0) {
      this.vehicleHiddenState = {vehicleOne:false,vehicleTwo:false,vehicleThree:false}
    }
   
    this.showSpinner = false; */
  }
  constructor(private router: Router, 
    private fs: FormsService, private us: UserService) {

    this.fs.getVehiclesObs().subscribe((x:IVehicle[]) =>  {
      console.log(this.me + '>> getVehiclesObs()')
      if(x.length > 0){
        this.processVehicles(x);
      }
    });
  }
};
