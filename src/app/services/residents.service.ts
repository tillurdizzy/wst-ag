import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DialogComponent } from '../library/dialog/dialog.component';
import { IResidentAccount, IResidentInsert } from './interfaces/iuser';
import { IProfile, IProfileUpdate } from './interfaces/iuser';
import { IUserAccount, IUserUpdate } from './interfaces/iuser';
import { IUnit } from './interfaces/iuser';

@Injectable({
  providedIn: 'root'
})
export class ResidentsService {
  private supabase: SupabaseClient;
  private userAccount: IUserAccount = { id:0, username: '', role: '', cell: '', email: '', units: [], uuid:'' ,firstname:'',lastname:'',csz:'',street:'',alerts:''};
  private emptyResidentAccount: IResidentAccount= { firstname:'', lastname:'', cell: '', email: '',uuid:'', id:0, alerts:''};
  private myUnit: IUnit = { unit:100, street:'',sqft:0, bdrms:1 , bldg:''};
  currentUnit:number = 0;

  unitSelectionHandler(u:number){
    console.log("UnitService  > unitSelectionHandler() = " + u)
    this.currentUnit = u;
    //this.us.fetchUnit(u);
    this.fetchResidentProfiles(this.currentUnit);
    //this.supabase.fetchResidentVehicles(this.currentUnit);
  }

  //* >>>>>>>>>>> OBSERVABLES  <<<<<<<<<<<<
  //^unit$
  private unitBS: BehaviorSubject<IUnit> = new BehaviorSubject(this.myUnit);
  public unit$ = this.unitBS.asObservable();

  getUnitObs(): Observable<IUnit> {
    return this.unit$
  }
  setUnitObs(u:IUnit){
    this.unitBS.next(u)
  }

//^residents$
private residentsBS: BehaviorSubject<IResidentAccount[]> = new BehaviorSubject([]);
public residents$ = this.residentsBS.asObservable();

getResidentsObs(): Observable<IResidentAccount[]> {
  return this.residents$
}
setResidentObs(n:IResidentAccount[]){
   //Sort descending order... larger number is "Primary" resident - i.e. Owner
  n.sort((e1, e2) => e1.id > e2.id ? -1 : e1.id < e2.id ? 1 : 0);

  let role = this.userAccount.role;
  var ownerUuid = this.userAccount.uuid;
  var clone = structuredClone(this.emptyResidentAccount);
  var residentAccountArray = [];
  if (role == 'admin') {
    residentAccountArray.push(n[0])
    residentAccountArray.push(n[1])

  }else if(role == 'non-resident'){
    residentAccountArray.push(n[0])
    residentAccountArray.push(n[1])
    
  }else if (role == 'resident' && ownerUuid != null) {
    clone.firstname = this.userAccount.firstname;
    clone.lastname = this.userAccount.lastname;
    clone.cell = this.userAccount.cell;
    clone.email = this.userAccount.email;
    clone.id = this.userAccount.id;
    clone.alerts = this.userAccount.alerts;
    clone.uuid = this.userAccount.uuid;
    residentAccountArray.push(clone)
    residentAccountArray.push(n[1])
    
  } else if (role == 'resident +') {
    // If owner is 'resident +', get currentUnit info from Accounts table Units.reSidesAt!
    //^ currentUnitselected == ResidesAt
    let u = this.userAccount.units;
    let v = this.parseObj(u, 'residesAt');
    if (v == this.currentUnit  && ownerUuid != null)  {
      residentAccountArray.push(n[0])
      residentAccountArray.push(n[1])
    } 
  }
  this.residentsBS.next(residentAccountArray);
}

updateResidentProfile(updatedProfile:IProfile){
  console.log("UnitService  > updateResidentProfile()")
  var subData:IResidentAccount[] = undefined;
  var newData:IResidentAccount[] = [];
  const sub = this.residentsBS.subscribe(p => subData = p);
  sub.unsubscribe();
  let updateID =  updatedProfile.id;
  for (let index = 0; index < subData.length; index++) {
    const element = subData[index];
    let thisID = element.id;
    if (thisID = updateID) {
      subData[index].email = updatedProfile.email
      subData[index].firstname = updatedProfile.firstname
      subData[index].lastname = updatedProfile.lastname
      subData[index].cell = updatedProfile.cell
    }
    newData.push(subData[index])
  }
  this.residentsBS.next(subData);
}

//* >>>>>>>>>>>>>>>>>>> FETCH RESIDENT DATA <<<<<<<<<<<<<<<<<<<<<<<
async fetchResidentProfiles(unit: number) {
  console.log('SupabaseService > fetchResidentProfiles()');
  try {
    let data = await this.supabase.from('profiles').select('*').eq('unit', unit);
    //this.publishData('UnitService','fetchResidentProfiles',data.data);
  } catch (error) {
    //this.showResultDialog('ERROR: ' + JSON.stringify(error))
  }
}

async fetchUnit(unit: number) {
  console.log('SupabaseService > fetchUnit()');
  try {
    let { data, error } = await this.supabase.from('units').select('*').eq('unit', unit).single();
    if(data != null){
      //this.publishUnitData(data); 
    }else{
      //this.showResultDialog('ERROR: ' + JSON.stringify(error))
    }
   
  } catch (error) {
    //this.showResultDialog('ERROR: ' + JSON.stringify(error))
  }
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

  constructor() {

    console.log('ResidentsService > constructor() ');
    try {
      this.supabase = createClient(
        environment.supabaseUrl,
        environment.supabaseKey
      );
    } catch (error) {
      alert('Create Client error: ' + JSON.stringify(error));
    }
  }
}
