import { Injectable } from '@angular/core';
import { Observable, Subject, Subscription, BehaviorSubject } from 'rxjs'
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { IUnit } from './interfaces/iuser';
import { IProfile, IProfileUpdate } from './interfaces/iuser';
import { ISpaceUpdate, IVehicle, IVehicleTable } from './interfaces/iuser';
import { SupabaseService } from '../services/supabase.service';
import { IResidentAccount, IResidentInsert } from './interfaces/iuser';
import { IUserAccount, IUserUpdate } from './interfaces/iuser';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FormsService {
  private supaSubscription: Subscription
  private supabase: SupabaseClient;
  private allUnits = [101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120,
    121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 200, 201, 202,
    203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225,
    226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 300, 301, 302, 303, 304, 305, 306, 307, 308, 309, 310, 311,
    312, 313, 314, 315, 316, 317, 318, 319, 320, 321, 322, 323, 324, 325, 326, 327, 328, 329, 330, 331, 332, 333, 334,
    335, 336, 400, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414, 415, 416, 417, 418, 419, 420,
    421, 422, 423, 424, 425, 426, 500, 501, 502, 503, 504, 505, 506, 507, 508, 509, 510, 511, 512, 513, 514, 515, 516,
    517, 518, 519, 520, 521, 522, 523, 524, 525, 526, 527, 528, 529, 530, 531, 532, 533, 534, 535, 536, 537, 538, 539,
    540, 541, 542, 543, 544, 545, 546, 547, 548, 549, 550, 551, 552, 553]

  
  private unitVehicles: IVehicle[] = [];
  private unitProfiles: IProfile[] = [];

 
  //private ownerInfo: IUnit = { name: '', unit: 0, street: '', csz: '', cell: '', email: '' };
  private selectedUnit: IUnit = { unit:100, street:'',sqft:0, bdrms:1 , bldg:''};
  private userAccount: IUserAccount = { id:0, username: '', role: '', cell: '', email: '', units: [], uuid:'' ,firstname:'',lastname:'',csz:'',street:'',alerts:''};
  private emptyResidentAccount: IResidentAccount= { firstname:'', lastname:'', cell: '', email: '',uuid:'', id:0, alerts:''};
  

  // * Selected for any reason... most likely for editing
  private selectedProfile: IProfile;
  private selectedVehicle: IVehicle;

  private currentUnit: number;

  //* >>>>>>>>>>> OBSERVABLES  <<<<<<<<<<<<
  //^unit$
  private unitBS: BehaviorSubject<IUnit> = new BehaviorSubject(this.selectedUnit);
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

  //^vehicles$
  private vehiclesBS: BehaviorSubject<IVehicle[]> = new BehaviorSubject([]);
  public vehicles$ = this.vehiclesBS.asObservable();

  getVehiclesObs(): Observable<IVehicle[]> {
    return this.vehicles$
  }

  setVehiclesObs(n:IVehicle[]){
    n.sort((e1, e2) => e1.space > e2.space ? 1 : e1.space < e2.space ? -1 : 0);
    this.vehiclesBS.next(n);
  }

  unitSelectionHandler(u:number){
    console.log("UnitService  > unitSelectionHandler() = " + u)
    this.currentUnit = u;
    //this.us.fetchUnit(u);
    this.fetchResidentProfiles(this.currentUnit);
    //this.supabase.fetchResidentVehicles(this.currentUnit);
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

 

  async removeVehicle(id: number, unit: number) {
    let noCar = {
      name: '',
      tag: '',
      make: '',
      model: '',
      color: ''
    };
    try {
      let { data, error } = await this.supabase.from('parking').update(noCar).eq('id', id).select();
      if(error == null){

        this.fetchResidentVehicles(unit);
        this.showResultDialog('Vehicle removed.')
      }else{
        this.showResultDialog('ERROR: ' + JSON.stringify(error))
      }
    } catch (error) {
      this.showResultDialog('ERROR: ' + JSON.stringify(error))
    }finally{
      //this.router.navigate(['/home']);
      
    }
  };

  async updateParkingSpace(
    space: ISpaceUpdate,
    id: string,
    nav: string,
    unit: number
  ) {
    try {
      let { data, error } = await this.supabase.from('parking').update(space).eq('id', id).select();
     
     if(data != null){
      this.fetchResidentVehicles(unit);
      this.showResultDialog('Vehicle Updated.')
     }
    } catch (error) {
      this.showResultDialog('ERROR: ' + JSON.stringify(error))
    }finally{
      //this.router.navigate([nav]);
    }
  };

  

  async updateVehicle(obj: IVehicleTable, s: number) {
    const { error } = await this.supabase
      .from('parking')
      .update(obj)
      .match({ space: s });

    if (error) {
      this.showResultDialog('ERROR: ' + JSON.stringify(error))
    } else {
      //this.getUserVehicles(this.ds.getUserUnitNumber());
    }
  }
  
  // * >>>>>>>>>>>>>>>> Data Service <<<<<<<<<<<<<<<<<<

  private subject = new Subject<any>();

  public sendData(message: any) {
    console.log("UnitService  > sendData > message = " + JSON.stringify(message));
    this.subject.next(message);
  };

  clearData() {
    this.subject.next(null);
    this.currentUnit = undefined;
  };

  getData(): Observable<any> {
    return this.subject.asObservable();
  };

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

  doConsole(message: string) {
    console.log(message);
  };

  isUnitValid(u: number): boolean {
   
    if (Number.isNaN(u)) { return false; }

    let ndx = this.allUnits.indexOf(u);
    if (ndx < 0) { return false; }

    return true;
  };

  //* SUPABASE CALLS

  //* >>>>>>>>>>>>>>>>>>> FETCH RESIDENT DATA <<<<<<<<<<<<<<<<<<<<<<<
  async fetchResidentProfiles(unit: number) {
    this.doConsole('SupabaseService > fetchResidentProfiles()');
    try {
      let data = await this.supabase.from('profiles').select('*').eq('unit', unit);
      this.publishData('UnitService','fetchResidentProfiles',data.data);
    } catch (error) {
      this.showResultDialog('ERROR: ' + JSON.stringify(error))
    }
  }

  async fetchResidentVehicles(unit: number) {
    this.doConsole('SupabaseService > fetchResidentVehicles()');
    try {
      let data = await this.supabase.from('parking').select('*').eq('unit', unit);
      if(data != null && data!=undefined){
        this.publishData('UnitService','fetchResidentVehicles',data.data);
      }
    } catch (error) {
      this.showResultDialog('ERROR: ' + JSON.stringify(error))
    }
  }

  async fetchUnit(unit: number) {
    this.doConsole('SupabaseService > fetchUnit()');
    try {
      let { data, error } = await this.supabase.from('units').select('*').eq('unit', unit).single();
      if(data != null){
        this.publishUnitData(data); 
      }else{
        this.showResultDialog('ERROR: ' + JSON.stringify(error))
      }
     
    } catch (error) {
      this.showResultDialog('ERROR: ' + JSON.stringify(error))
    }
  }

  publishUnitData(data) {

    let dataObj = {
      to: 'UnitService',
      event: 'publishUnitData',
      iUnit: data,
    };
    this.sendData(dataObj);
    //! replace with Obsv
    /* this.dataObj = {
      to: 'DetailsComponent',
      event: 'publishUnitData',
      iUnit: data,
    };
    this.sendData(this.dataObj); */
  }

  publishData(to:string,event:string,data:any) {
    let dataObj = {
      to:to,
      event: event,
      data: data
    };
    this.sendData(dataObj);
  }

 

  showResultDialog(message:string){
      
  /* 
      setTimeout(() => {
        this.dialogRef.close();
      }, 2000); */
  }

 

  // * SETTERS
  setUnitProfiles(data: IProfile[]) {
    this.unitProfiles = data;
  }

  setUnitVehicles(data: IVehicle[]) {
    this.unitVehicles = data;
  };

  setUserAccount(account:IUserAccount){
    this.userAccount = account;
  };
  

  setSelectedProfile(p: IProfile) {
    this.selectedProfile = p;
  };

  setSelectedVehicle(car: IVehicle) {
    this.selectedVehicle = car;
  };

  
  /* setCurrentUnit(u: number) {
    this.currentUnit = u;
    this.supabase.fetchUnit(u);
    
  }; */

  // Called ngDestroy in  AdminComponent
  resetUnitData() {
    this.unitVehicles = [];
    this.unitProfiles = [];
    this.currentUnit = 0;
    this.selectedUnit = { unit:100, street:'',sqft:0, bdrms:1 , bldg:''};
  }

  //* GETTERS

  getAdminProfiles(): IProfile[] {
    return this.unitProfiles;
  };

  getSelectedUnit(): IUnit{
    return this.selectedUnit
  }

  getUserVehicles(): IVehicle[] {
    return this.unitVehicles;
  };

  getSelectedProfile(): IProfile {
    return this.selectedProfile;
  };

  getUpdateProfileID():number{
    var x = 0;
    if(this.selectedProfile != undefined){
      x = this.selectedProfile.id;
    }
    return x;
  }

  getSelectedVehicle(): IVehicle {
    return this.selectedVehicle;
  };

  getCurrentUnit() {
    return this.selectedUnit.unit;
  };

  getResidentID(): number {
    var id: number = this.selectedProfile.id;
    return id;
  };

  isSpaceValid(space: string) {
    return true;
  };

  isSpaceAvailable(space: string) {
    return true;
  };

  ngOnDestroy(): void {
    this.supaSubscription.unsubscribe();
  }

  //* >>>>>>>>>>>>>>> CONSTRUCTOR / SUBSCRIPTIONS <<<<<<<<<<<<<<<<<<<<

  constructor() {

    console.log('FormService > constructor() ');
    try {
      this.supabase = createClient(
        environment.supabaseUrl,
        environment.supabaseKey
      );
    } catch (error) {
      alert('Create Client error: ' + JSON.stringify(error));
    }
  }
};

