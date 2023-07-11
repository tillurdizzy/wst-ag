import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Observable, BehaviorSubject } from 'rxjs';
import { Subscription } from 'rxjs'
import { Router } from '@angular/router';
import { DialogComponent } from '../library/dialog/dialog.component';
import { IResidentAccount, IResidentInsert } from './interfaces/iuser';
import { IProfile, IProfileUpdate } from './interfaces/iuser';
import { IUserAccount, IUserUpdate } from './interfaces/iuser';
import { IUnit } from './interfaces/iuser';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ResidentsService {
  private supabase: SupabaseClient;
  private subscription:Subscription
  private userAccount: IUserAccount = { id:0, username: '', role: '', cell: '', email: '', units: [], uuid:'' ,firstname:'',lastname:'',csz:'',street:'',alerts:''};
  private emptyResidentAccount: IResidentAccount[]= [{ firstname:'', lastname:'', cell: '', email: '',uuid:'', id:0, alerts:''}];
  private myUnit: IUnit = { unit:0, street:'',sqft:0, bdrms:1 , bldg:''};
  currentUnit:number = 0;

  unitSelectionHandler(u:number){
    console.log("ResidentsService  > unitSelectionHandler() = " + u)
    this.currentUnit = u;
    this.fetchResidentProfiles(this.currentUnit);
  }

  //* >>>>>>>>>>> OBSERVABLES  <<<<<<<<<<<<
  //^unit$
  private unitBS: BehaviorSubject<IUnit> = new BehaviorSubject(this.myUnit);
  public unit$ = this.unitBS.asObservable();

  getUnitObs(): Observable<IUnit | boolean> {
    return this.unit$
  }
  setUnitObs(u:IUnit){
    this.unitBS.next(u)
  }

//^residents$
private residentsBS: BehaviorSubject<IResidentAccount[]> = new BehaviorSubject(this.emptyResidentAccount);
public residents$ = this.residentsBS.asObservable();

getResidentsObs(): Observable<IResidentAccount[] | boolean> {
  return this.residents$
}
setResidentObs(data:IResidentAccount[]){
   //Sort descending order... larger number is "Primary" resident - i.e. Owner
   data.sort((e1, e2) => e1.id > e2.id ? -1 : e1.id < e2.id ? 1 : 0);

  let role = this.userAccount.role;
  var ownerUuid = this.userAccount.uuid;
  var clone = structuredClone(this.emptyResidentAccount[0]);
  var residentDisplay = [];
  if (role == 'admin') {
    residentDisplay.push(data[0])
    residentDisplay.push(data[1])

  }else if(role == 'non-resident'){
    residentDisplay.push(data[0])
    residentDisplay.push(data[1])
    
  }else if (role == 'resident' && ownerUuid != null) {
    //* If Ower/User is also Resident, get Primary Resident name and info from Account because profile table is empty
    clone.firstname = "Owner Occupied"
    clone.lastname = "";
    clone.cell = "";
    clone.email = "";
    clone.id = this.userAccount.id;
    clone.alerts = this.userAccount.alerts;
    clone.uuid = this.userAccount.uuid;
    residentDisplay.push(clone)
    residentDisplay.push(data[1])
    
  } else if (role == 'resident +') {
    // If owner is 'resident +', get currentUnit info from Accounts table Units.reSidesAt!
    //^ currentUnitselected == ResidesAt
    let u = this.userAccount.units;
    let v = this.parseObj(u, 'residesAt');
    if (v == this.currentUnit  && ownerUuid != null)  {
      residentDisplay.push(data[0])
      residentDisplay.push(data[1])
    } 
  }
  this.residentsBS.next(residentDisplay);
}

processResidentData(data){
  console.log("ResidentsService  > processResidentData()")
  if(data == null){return}
    
    let myProfiles = [];
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
      myProfiles.push(clone);
    }
    console.log("ResidentsService  > residentsBS.next(myProfiles)")
    this.setResidentObs(myProfiles);
  }

  async updateResident(p:IResidentInsert, id:number,unitNum:number){
    console.log('ResidentsService  > updateResident() id = ' + id);
    try {
      let { data, error } = await this.supabase.from('profiles').update(p).match({ id: id }).select();
      if(error == null){
        this.fetchResidentProfiles(unitNum)
      }  
    } catch (error) {
      alert(error.message);
    }
  }



//* >>>>>>>>>>>>>>>>>>> FETCH RESIDENT DATA <<<<<<<<<<<<<<<<<<<<<<<
async fetchResidentProfiles(unit: number) {
  console.log('ResidentsService > fetchResidentProfiles() unit = ' + unit);
  try {
    let data = await this.supabase.from('profiles').select('*').eq('unit', unit);
    this.processResidentData(data.data)
  } catch (error) {
    //this.showResultDialog('ERROR: ' + JSON.stringify(error))
  }
}

async fetchUnit(unit: number) {
  console.log('ResidentsService > fetchUnit()');
  try {
    let { data, error } = await this.supabase.from('units').select('*').eq('unit', unit).single();
    if(data != null){
      this.setUnitObs(data as IUnit)
    }else{
      //this.showResultDialog('ERROR: ' + JSON.stringify(error))
    }
   
  } catch (error) {
    //this.showResultDialog('ERROR: ' + JSON.stringify(error))
  }
}

handleAccount$(x){
  this.userAccount = x;
}


//* >>>>>>>>>>>>>>>  UTILITIES <<<<<<<<<<<<<<<<<<<<<<<>

parseObj(obj, key) {
  var x;
  Object.keys(obj).forEach((k) => {
    if (k == key) {
      x = obj[k];
    }
  });
  return x;
}

removeNull(obj) {
  Object.keys(obj).forEach(k => {
    if (obj[k] === null || obj[k] === undefined) {
      obj[k] = '';
    }
  });
  return obj;
};

resetService(){
  this.unitBS.next(this.myUnit);
  this.residentsBS.next(this.emptyResidentAccount);
}

  constructor(private us:UserService) {

    console.log('ResidentsService > constructor() ');
    try {
      this.supabase = createClient(
        environment.supabaseUrl,
        environment.supabaseKey
      );
    } catch (error) {
      alert('Create Client error: ' + JSON.stringify(error));
    }

    this.subscription = this.us.getUserAccount$().subscribe((x) => {
      this.handleAccount$(x);
    });
  }
}
