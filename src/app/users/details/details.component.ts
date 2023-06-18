import { Component, OnInit} from '@angular/core';
import { SupabaseService } from '../../services/supabase.service';

import { FormsService } from 'src/app/services/forms.service';
import { UserService } from 'src/app/services/user.service';
import { Subscription } from 'rxjs'
import { Router } from '@angular/router'
import { IVehicle } from 'src/app/services/interfaces/iuser';
import { IUnit } from 'src/app/services/interfaces/iuser';
import { IResidentAccount, IResident, IResidentInsert } from 'src/app/services/interfaces/iuser';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit{
  me: string = "DetailsComponent"
  supaScription: Subscription;
  showSpinner:boolean = false;
 
  unitSelected:boolean = false;
  ownerRole:string = 'resident'
  maxResidents = false;
  dialog: any;
  residentEditStates = {residentOne:true,residentTwo:true}
  vehicleEditStates = {vehicleOne:true,vehicleTwo:true,vehicleThree:true}
  residentHiddenState = {residentOne:true,residentTwo:true}
  vehicleHiddenState = {vehicleOne:true,vehicleTwo:true,vehicleThree:true}
 
  //* 
  myProfiles: IResidentAccount[] = [{ firstname: '', lastname: '', email: '', cell: '',uuid:'', id:0, alerts:''}];
  myVehicles: IVehicle[] = [{ name: '', tag: '', space: '', make: '', model: '', color: '', unit: 0, link: '', url: '', id: 0, sort: '' }];
  myUnit: IUnit = { unit:100, street:'',sqft:0, bdrms:1 , bldg:''};

  //* Single objects chosen from table to edit
  editProfile: IResidentAccount = { firstname: 'x', lastname: 'x', email: '', cell: 'x', uuid: '', id:0, alerts:''};
  editVehicle: IVehicle = { name: '', tag: '', space: '', make: '', model: '', color: '', unit: 0, link: '', url: '', id: 0, sort: '' };


  ngOnInit(): void {
    console.log(this.me + " ngOnInit()")
    //this.ownerRole = this.us.getOwnerRole();
    let u = this.fs.getCurrentUnit;
    //this.fs.unitSelectionHandler(u)
  }

  cancelBackBtn(){
    this.router.navigate(['/home']);
  }

  ngOnDestroy() {
    this.us.clearData();
    this.supaScription.unsubscribe();
  };

  // >>>>>>>>>>>  TABLE EDIT HANDLERS <<<<<<<<<<<<<

  onVehicleClick(n: number) {
    console.log(this.me + " onVehicleClick() = " + n)
    this.editVehicle = this.myVehicles[n];
    this.fs.setSelectedVehicle(this.editVehicle);
    this.router.navigate(['/units/edit-vehicle']);
  };

  onResidentClick(n: number) {
    console.log(this.me + " onResidentClick() = " + n)
    this.editProfile = this.myProfiles[n];
    this.fs.setSelectedProfile(this.editProfile);
    this.router.navigate(['/units/edit-resident']);
  };

  resetTableData() {
    this.residentEditStates = {residentOne:true,residentTwo:true}
    this.residentHiddenState = {residentOne:true,residentTwo:true}
  };

  //* >>>>>>>>>>>>  SUBSCRIPTION HANDLERS  >>>>>>>>>>>>\\

  private processProfiles(data:any){
    if(data == null){return}
    this.resetTableData()
    this.myProfiles = [];
    for (let index = 0; index < data.length; index++) {
      let p:IResidentAccount = { firstname: '', lastname: '', email: '', cell: '', uuid: '', id:0, alerts:''};
      const element = data[index];
      p.firstname = element.firstname;
      p.lastname = element.lastname;
      p.email = element.email;
      p.cell = element.cell;
      p.uuid = element.uuid;
      p.id = element.id;
      p.alerts = element.alerts;
     
      let clone = structuredClone(p);
      this.myProfiles.push(clone);
    }
   
    this.fs.setUnitProfiles(this.myProfiles);
    let x = this.myProfiles.length;
    if(x > 2) {x = 2}
    if (x == 2) {
      this.residentHiddenState = {residentOne:true,residentTwo:true}
    } else if (x == 1) {
      this.residentHiddenState = {residentOne:true,residentTwo:false}
    } else if (x == 0) {
      this.residentHiddenState = {residentOne:false,residentTwo:false}
    }
    if(this.ownerRole == 'resident'){
      this.residentEditStates.residentOne = false;
    }
  }

  private processVehicles(data:any){
    if(data == null){return}
    this.myVehicles = data;
    this.fs.setUnitVehicles(this.myVehicles);
    let x = this.myVehicles.length;
    if (x == 3) {
      this.vehicleHiddenState = {vehicleOne:true,vehicleTwo:true,vehicleThree:true}
    } else if (x == 2) {
      this.vehicleHiddenState = {vehicleOne:true,vehicleTwo:true,vehicleThree:false}
    } else if (x == 1) {
      this.vehicleHiddenState = {vehicleOne:true,vehicleTwo:false,vehicleThree:false}
    } else if (x == 0) {
      this.vehicleHiddenState = {vehicleOne:false,vehicleTwo:false,vehicleThree:false}
    }
   
    this.showSpinner = false;
  }

  constructor(private supabase: SupabaseService, private router: Router, 
    private fs: FormsService, private us: UserService) {

    this.fs.getResidentsObs().subscribe((x:IResidentAccount[]) =>  {
      this.processProfiles(x);
    });

    this.fs.getVehiclesObs().subscribe((x:IVehicle[]) =>  {
      this.processVehicles(x)
    });

    this.fs.getUnitObs().subscribe((x:IUnit) =>  {
      this.myUnit = x;
      console.log('DetailsComponent >> getUnitObs = ' + this.myUnit.unit + " sqft = " + this.myUnit.sqft)
    });

    this.supaScription = this.supabase.getData().subscribe(x => {
      if(x != null){
        var dataPassed = x;
        if(dataPassed.to == this.me){
         if(dataPassed.event == 'publishUnitData' ){
            this.myUnit = dataPassed.iUnit;
          }
        }
      }
    })
  }
};