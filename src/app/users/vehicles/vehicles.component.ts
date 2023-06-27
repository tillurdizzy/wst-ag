import { Component, OnInit} from '@angular/core';
import { IUnit } from 'src/app/services/interfaces/iuser';
import { IVehicle, IVehicleUpdate } from 'src/app/services/interfaces/iuser';
import { Subscription } from 'rxjs'
import { Router } from '@angular/router'
import { VehiclesService } from 'src/app/services/vehicles.service';
import { UserService } from 'src/app/services/user.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.scss']
})
export class VehiclesComponent implements OnInit{
  me = "VehiclesComponent";
 
  display:string = "data";
  userSubscribe: Subscription;
  myVehicles: IVehicle[] = [{ name: '', tag: '', space: '', make: '', model: '', color: '', unit: 0, link: '', url: '', id: 0, sort: '' }];
  editVehicle: IVehicle = { name: '', tag: '', space: '', make: '', model: '', color: '', unit: 0, link: '', url: '', id: 0, sort: '' };

  form: FormGroup = new FormGroup({
    name: new FormControl ("", Validators.required),
    tag:  new FormControl("", Validators.required),
    make: new FormControl ("", Validators.required),
    model: new FormControl ("", Validators.required),
    color: new FormControl ("", Validators.required)
  });

  ngOnInit(): void {
   
  }

  private processVehicles(data:any){
    console.log(this.me + '>> processVehicles()')
    if(data == null){return}
    this.myVehicles = data;
    let x = this.myVehicles.length;
  }

  submitForm() {
    if (this.form.valid) {
      console.log(this.form.value); // Perform further actions with the form data
      let formData:IVehicleUpdate = this.form.value;

      //this.vs.updateParkingSpace(formData)
      this.form.reset(); // Optional: Reset the form after submission
      this.display = 'data'
    }
  }

  handleChildData(spaceNum){
    
    for (let index = 0; index < this.myVehicles.length; index++) {
      const element = this.myVehicles[index];
      if(element.space == spaceNum){
        this.editVehicle = element;
      }else{
       // this.updatedProfiles.push(element);
      }
      this.form.patchValue(this.editVehicle);
      this.showUpdateForm()
    }
  }

  showUpdateForm(){
    this.display = 'form'
  }

  hideUpdateForm(){
    this.display = 'data'
  }

  constructor(private vs: VehiclesService, private us: UserService) {
    console.log('VehiclesComponent >> constructor() ');
    this.vs.getVehiclesObs().subscribe((x:IVehicle[]) =>  {
      console.log(this.me + '>> getVehiclesObs()')
      if(x.length > 0){
        this.processVehicles(x);
      }
    });
  }
};
