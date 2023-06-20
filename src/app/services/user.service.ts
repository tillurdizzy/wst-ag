import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DialogComponent } from '../library/dialog/dialog.component';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { AuthChangeEvent, AuthSession } from '@supabase/supabase-js';
import { Session, User } from '@supabase/supabase-js';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { IWorkOrder, IBasicForm } from './interfaces/iforms';
import { IUserAccount, IUserUpdate } from './interfaces/iuser';
import { IResidentInsert } from './interfaces/iuser';
import { IProfileFetch, IProfileUpdate, IProfile } from './interfaces/iuser';
import { ISpaceUpdate, ISpaceBasic } from './interfaces/iuser';
import { IVehicle, IVehicleTable, IVehicleUpdate } from './interfaces/iuser';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private supabase: SupabaseClient;
  private userAuthenticated: boolean = false;
  private userid: string | null = null;
  private session:{} = {};
  private userObj:User = null;
  private userAccount: IUserAccount = { id:0, username: '', role: '', cell: '', email: '', units: [], uuid:'' ,firstname:'',lastname:'',csz:'',street:'',alerts:''};
  private myCurrentUnit: number;
  private iProfile: IProfile;

  private vehicle: IVehicle;
  private myVehicles: IVehicle[] = [];

     //* Observables
  _session: AuthSession | null = null;
  private currentUser: BehaviorSubject < User | boolean > = new BehaviorSubject(false);
  public currentUser$ = this.currentUser.asObservable();

  getCurrentUser(): Observable <User | boolean> {
    return this.currentUser.asObservable();
  }

  private userAccountObs: BehaviorSubject < IUserAccount | boolean > = new BehaviorSubject(false);
  public userAccount$ = this.userAccountObs.asObservable();

  getUserAccount(): Observable <IUserAccount | boolean> {
    return this.userAccount$;
  }
  setUserAccount(x:IUserAccount){
    this.userAccountObs.next(x);
  }


   //* >>>>>>>>>>>>>>>>>>> USER / AUTH / SESSION / ACCOUNT <<<<<<<<<<<<<<<<<<<<<<<

  async loadUser() {
    console.log('UserService > loadUser() ' + this.currentUser.value);
    if (this.currentUser.value) {// User is already set, no need to do anything else
      return;
    }
    // this will create a 401 error when no user is logged it yet-- ignore it
    const user = await this.supabase.auth.getUser();
    if (user.data.user) {
      this.currentUser.next(user.data.user);
    } else {
      this.currentUser.next(false);
    }
  }

  

  getCurrentUserId(): string {
    if (this.currentUser.value) {
      return (this.currentUser.value as User).id;
    } else {
      return '';
    }
  }

  getSession() {
    this.supabase.auth.getSession().then(({ data }) => {
      this._session = data.session;
    });
    return this._session;
  }

  private authenticateUser(data: any) {
    console.log('UserService >> authenticateUser()');
    this.userAuthenticated = true;
    this.userObj = data.data.user;
    this.session = data.session;
    this.currentUser.next(this.userObj);
  
    let uid =this.userObj.id;
    //this.getUserAccount(uid);
  };

  isUserAuthenticated() {
    let obj = {
      'auth': this.userAuthenticated, 
      'account':this.userAccount,
    }
    return obj;
  };



  private processUserAccount(data:any) {
    console.log("UserService >> processUserAccount()");
   
    this.userAccount.cell = data.cell;
    this.userAccount.email = data.email;
    this.userAccount.id = data.id;
    this.userAccount.uuid = data.uuid;
    this.userAccount.username = data.username;
    this.userAccount.role = data.role;
    this.userAccount.firstname = data.firstname;
    this.userAccount.lastname = data.lastname;
    this.userAccount.alerts = data.alerts;
    this.userAccount.street = data.street;
    this.userAccount.csz = data.csz;
    this.userAccount.units = data.units.units;
  
    if(this.userAccount.units.length > 0){
      this.myCurrentUnit = this.userAccount.units[0]
    }
    this.userAccountObs.next(this.userAccount)
  }

 

  // Chain of Calls... signIn >> getUserAccount >> ds.getOwner
  async signIn(credentials: { email: string; password: string }) {
    console.log('UserService > signIn() ' + JSON.stringify(credentials));
    try {
      var result = await this.supabase.auth.signInWithPassword(credentials);
      if(result.data.user == null){
        throw result.error.message
      }
      this.authenticateUser(result)
    } catch (error) {
      alert("Error: "  + JSON.stringify(error))
    }
  }

  async signUp(credentials: { email: string; password: string }) {
    this.doConsole('UserService > signUp()' + JSON.stringify(credentials));
    try {
      var result = await this.supabase.auth.signUp(credentials);
      if(result.data.user == null) {
        throw result.error.message
      }else {
        this.showResultDialog('User created: ' + result.data.user.id)
      }
    } catch (error) {
      this.showResultDialog('Error: ' + error)
    };
  }

  authChanges(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    this.doConsole('UserService > authChanges() ');
    return this.supabase.auth.onAuthStateChange(callback);
  }

  signOut() {
    return this.supabase.auth.signOut();
  }

  // Password Reset... this called first with only Email to initiate change
  async resetPassword(email: string ){
    try {
      const { data, error } = await this.supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'http://localhost:4200/password-reset'})
      if(error == null){
        this.showResultDialog('Check your email for Password Reset link.')
      }
    } catch (error) {
      this.showResultDialog('ERROR: ' + JSON.stringify(error))
    }finally{
      this.router.navigate(['/home']);
    }
  }

// Actual Password Update
  async updatePassword(new_password:string){
    try {
      const { data, error } = await this.supabase.auth.updateUser({password: new_password})
      if(error == null){
        this.showResultDialog('Password reset.  Please log in.')
      }
    } catch (error) {
      
    }finally{
      this.router.navigate(['/home']);
    }
  }

  
  //* >>>>>>>>>>>>  FORMS  <<<<<<<<<<<<\\
  async insertWorkOrder(wo:IWorkOrder){
    try {
      const { data, error } = await this.supabase.from('work-orders').insert(wo);
      if(error == null){
        this.showResultDialog('Work Order submitted.')
      }else{
        this.showResultDialog('ERROR: ' + JSON.stringify(error))
      }
      
    } catch (error) {
      this.showResultDialog('ERROR: ' + JSON.stringify(error))
    }finally{
      this.router.navigate(['/home']);
    }
  }

  async insertBasicForm(frm:IBasicForm,message:string){
    try {
      const { data, error } = await this.supabase.from('forms').insert(frm).select();
      if(error == null){
        this.showResultDialog(message)
      }else{
        this.showResultDialog('ERROR: ' + JSON.stringify(error))
      }
    } catch (error) {
      this.showResultDialog('ERROR: ' + JSON.stringify(error))
    }finally{
      this.router.navigate(['/home']);
    }
  }

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
  
  
  
      //*>>>>>>>>>>>>>>>>>>>>  PROFILES / OWNER  <<<<<<<<<<<<<<<<<<<<
    async deleteProfile(id:number) {
      try {
        let { data, error } = await this.supabase.from('profiles').delete().eq('id', id);
        this.showResultDialog('Resident deleted.')
      } catch (error) {
        this.showResultDialog('ERROR: ' + JSON.stringify(error))
      }finally{
        this.router.navigate(['units/units-detail']);
      }
    }
  
    async insertNewProfile(profile: IProfileFetch) {
      this.doConsole('SupabaseService > insertNewProfile() profile >>' + JSON.stringify(profile));
      try {
        const { data, error } = await this.supabase.from('profiles').insert(profile);
        this.showResultDialog('New resident profile added.')
      } catch (error) {
        this.showResultDialog('ERROR: ' + JSON.stringify(error))
      }finally{
        this.router.navigate(['/units/units-detail']);
      }
    }
  
    async updateProfile(p: IProfileUpdate, id: number) {
      this.doConsole('updateProfile id = ' + id);
      try {
        const { data, error } = await this.supabase.from('profiles').update(p).eq('id',id ).select();
        if(data != null){
          let d = data[0] as IProfile;
  
          let dataObj = {
            to: "UnitService",
            event: 'updateResident',
            residentUpdate:d
          };
          this.sendData(dataObj);
        }
        
      } catch (error) {
        this.showResultDialog('ERROR: ' + JSON.stringify(error))
      }finally{
        this.router.navigate(['/home']);
      }
    }
    
    async fetchUserAccount(user: string) {
      console.log('Supabase >> fetchUserAccount()');
      try {
        let { data, error } = await this.supabase.from('accounts').select('*').eq('uuid', user);
        if(data != null){
          this.processUserAccount(data);
        }
      } catch (error) {
        alert("Sign in error: fetchUserAccount "  + JSON.stringify(error))
      }
    }
  
    async updateUserAccount(updateObj: IUserUpdate,id:string){
      
      try {
        const { data, error } = await this.supabase.from('accounts').update(updateObj).eq('uuid', id);
        if(error == null){this.showResultDialog('User account updated.')}
      } catch (error) {
        this.showResultDialog('ERROR: ' + JSON.stringify(error))
      }finally{
        this.router.navigate(['/home']);
      }
    }
  
    async getOwnerAccount(unit:number){
      try {
        let { data, error } = await this.supabase.from('units').select('*').eq('unit', unit);
        let dataObj = {
          to: 'DataService',
          event: 'getOwnerAccount',
          result: data[0]
        };
        this.sendData(dataObj);
      } catch (error) {
        alert("Sign in error: getOwner "  + JSON.stringify(error))
      }
    }
  
    async updateOwnerAccount(a:IResidentInsert,units){
      this.doConsole('SupabaseService > updateOwnerAccount() data >>' + JSON.stringify(a));
      try {
        const { data, error } = await this.supabase.from('units')
        .update(a)
        .in('unit', units);
        if(error == null){this.showResultDialog('Owner account updated.')}
      } catch (error) {
        this.showResultDialog('ERROR: ' + JSON.stringify(error))
      }finally{
        this.router.navigate(['/home']);
      }
    }
  
    //*>>>>>>>>>>>>>>>>>> Vehicles <<<<<<<<<<<<<<<<<<<<
  
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
        this.router.navigate(['/home']);
        
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
        this.router.navigate([nav]);
      }
    };
  
    private setMyVehicle(data: any) {
      this.myVehicles.length = 0;
      for (var i = 0; i < data.length; i++) {
        this.vehicle = data[i];
        this.myVehicles.push(this.vehicle);
      }
    }
  
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

  //* >>>>>>>>>>>>>> MESSENGER <<<<<<<<<<<<<<<<

  private subject = new Subject<any>();

  public sendData(message: any) {
    console.log('UserService > sendData >  to:' + message.to + ' event:' + message.event);
    this.subject.next(message);
  }

  clearData() {
    this.subject.next(null);
  }

  getData(): Observable<any> {
    return this.subject.asObservable();
  }

  publishData(to:string,event:string,data:any) {
    let dataObj = {
      to:to,
      event: event,
      data: data
    };
    this.sendData(dataObj);
  }

  doConsole(message: string) {
    console.log(message); 
  }

  showResultDialog(message:string){
     /*  const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      dialogConfig.hasBackdrop = false;
      dialogConfig.data = {
        title: 'Result',
        message: message,
      };
      this.dialogRef = this.dialog.open(DialogComponent, dialogConfig);
  
      setTimeout(() => {
        this.dialogRef.close();
      }, 2000); */
  }

  //* >>>>>>>>>>>>>>> CONSTRUCTOR / SUBSCRIPTIONS <<<<<<<<<<<<<<<<<<<<

  constructor(private router: Router, public dialogService: DialogService) {
    console.log('UserService > constructor() ');
    try {
      this.supabase = createClient(
        environment.supabaseUrl,
        environment.supabaseKey
      );
    } catch (error) {
      alert('Create Client error: ' + JSON.stringify(error));
    }

    this.supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, sess: Session | null) => {
        console.log('Begin: UserService > onAuthStateChange = ' + event +' > currentUser = ' + (this.currentUser.value as User).id);

        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          let s = sess;
          if (s != null) {
            var u: User = s.user;
            this.currentUser.next(u);
          }
        } else if (event === 'PASSWORD_RECOVERY') {
        } else {
          this.currentUser.next(false);
        }

        console.log(
          'End: UserService > onAuthStateChange:event= ' + event + ' > currentUser = ' + (this.currentUser.value as User).id
        );
      }
    );

    // Trigger initial session load
    this.loadUser();
  }
}