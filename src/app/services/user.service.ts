import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthChangeEvent, AuthSession } from '@supabase/supabase-js';
import { Session, User } from '@supabase/supabase-js';
import { IUserAccount, IUserUpdate } from './interfaces/iuser';
import { IProfileFetch, IProfileUpdate, IProfile } from './interfaces/iuser';


@Injectable({
  providedIn: 'root',
})
export class UserService {
  private supabase: SupabaseClient;
  private userAuthenticated: boolean = false;
  //private userid: string | null = null;
  private session:{} = {};
  private userObj:User = null;
  private userAccount: IUserAccount = { id:0, username: '', role: '', cell: '', email: '', units: [], uuid:'' ,firstname:'',lastname:'',csz:'',street:'',alerts:''};
  private myCurrentUnit: number;
  //private iProfile: IProfile;

     //* Observables
  _session: AuthSession | null = null;
  private userAuth: BehaviorSubject < User | boolean > = new BehaviorSubject(false);
  public userAuth$ = this.userAuth.asObservable();

  getAuth$(): Observable <User | boolean> {
    return this.userAuth.asObservable();
  }

  private userAccountObs: BehaviorSubject < IUserAccount> = new BehaviorSubject(this.userAccount);
  public userAccount$ = this.userAccountObs.asObservable();

  getUserAccount$(): Observable <IUserAccount> {
    return this.userAccount$;
  }
  setUserAccount$(x:IUserAccount){
    console.log('UserService >> setUserAccount$() ' + x);
    this.userAccountObs.next(x);
  }

  //* >>>>>>>>>>>>>>>>>>> USER / AUTH / SESSION / ACCOUNT <<<<<<<<<<<<<<<<<<<<<<<

  async loadUser() {
    console.log('UserService > loadUser() ' + this.userAuth.value);
    if (this.userAuth.value) {// User is already set, no need to do anything else
      return;
    }
    // this will create a 401 error when no user is logged it yet-- ignore it
    const user = await this.supabase.auth.getUser();
    if (user.data.user) {
      this.userAuth.next(user.data.user);
    } else {
      this.userAuth.next(false);
    }
  }

  getuserAuthId(): string {
    if (this.userAuth.value) {
      return (this.userAuth.value as User).id;
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
    this.userAuth.next(this.userObj);
  
    let uid =this.userObj.id;
  };

  async signIn(credentials: { email: string; password: string }) {
    console.log('UserService > signIn() ' + JSON.stringify(credentials));
    try {
      var result = await this.supabase.auth.signInWithPassword(credentials);
      if(result.data.user == null){
        throw result.error.message
      }
      this.authenticateUser(result);
    } catch (error) {
      alert("Error: "  + JSON.stringify(error))
    }
  }

  async signUp(credentials: { email: string; password: string }) {
    console.log('UserService > signUp()' + JSON.stringify(credentials));
    try {
      var result = await this.supabase.auth.signUp(credentials);
      if(result.data.user == null) {
        throw result.error.message
      }else {
        this.showResultDialog('Result','User created: ' + result.data.user.id)
      }
    } catch (error) {
      this.showResultDialog('Result','Error: ' + error)
    };
  }

  authChanges(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    console.log('UserService > authChanges() ');
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
        this.showResultDialog('Result','Check your email (possibly Junk folder) for Password Reset link.')
      }
    } catch (error) {
      this.showResultDialog('Result','ERROR: ' + JSON.stringify(error))
    }finally{
      this.router.navigate(['/home']);
    }
  }

// Actual Password Update
  async updatePassword(new_password:string){
    try {
      const { data, error } = await this.supabase.auth.updateUser({password: new_password})
      if(error == null){
        this.showResultDialog('Result','Password reset.  Please log in.')
      }
    } catch (error) {
      
    }finally{
      this.router.navigate(['/members']);
    }
  }


    async fetchUnit(unit: number) {
      console.log('UserService > fetchUnit()');
      try {
        let { data, error } = await this.supabase.from('units').select('*').eq('unit', unit).single();
        if(data != null){
          this.publishUnitData(data); 
        }else{
          this.showResultDialog('Result','ERROR: ' + JSON.stringify(error))
        }
       
      } catch (error) {
        this.showResultDialog('Result','ERROR: ' + JSON.stringify(error))
      }
    }
  
    publishUnitData(data) {
  
    }
  
  
  
      //*>>>>>>>>>>>>>>>>>>>>  PROFILES / OWNER  <<<<<<<<<<<<<<<<<<<<
    async deleteProfile(id:number) {
      try {
        let { data, error } = await this.supabase.from('profiles').delete().eq('id', id);
        this.showResultDialog('Result','Resident deleted.')
      } catch (error) {
        this.showResultDialog('Result','ERROR: ' + JSON.stringify(error))
      }finally{
        this.router.navigate(['units/units-detail']);
      }
    }
  
    async insertNewProfile(profile: IProfileFetch) {
      console.log('UserService > insertNewProfile() profile >>' + JSON.stringify(profile));
      try {
        const { data, error } = await this.supabase.from('profiles').insert(profile);
        this.showResultDialog('Result','New resident profile added.')
      } catch (error) {
        this.showResultDialog('Result','ERROR: ' + JSON.stringify(error))
      }finally{
        this.router.navigate(['/units/units-detail']);
      }
    }
  
    async updateProfile(p: IProfileUpdate, id: number) {
      console.log('updateProfile id = ' + id);
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
        this.showResultDialog('Result','ERROR: ' + JSON.stringify(error))
      }finally{
        this.router.navigate(['/home']);
      }
    }
    
    async fetchUserAccount(user: string) {
      console.log('UserService >> fetchUserAccount()');
      try {
        let { data, error } = await this.supabase.from('accounts').select('*').eq('uuid', user).single();
        if(data != null){
          this.processUserAccount(data);
        }
      } catch (error) {
        alert("Sign in error: fetchUserAccount "  + JSON.stringify(error))
      }
    }
  
    async updateUserAccount(updateObj: IUserUpdate,id:string){
      try {
        const { data, error } = await this.supabase.from('accounts').update(updateObj).eq('uuid', id).select();
        if(error == null){
          this.processUserAccount(data[0]);
          this.showResultDialog('Success','User account updated.')
        }
      } catch (error) {
        this.showResultDialog('Result','ERROR: ' + JSON.stringify(error))
      }finally{
        
      }
    }

    private processUserAccount(data:any) {
      console.log("UserService >> processUserAccount() " + data);
     
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
      this.setUserAccount$(this.userAccount);
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

  showResultDialog(title: string, message: string) {
    this.toastr.success(message, title);
  }

  resetService(){
    this.userAccountObs.next(this.userAccount);
    this.userAuth.next(false);
    this.supabase.auth.signOut();
  }

  //* >>>>>>>>>>>>>>> CONSTRUCTOR / SUBSCRIPTIONS <<<<<<<<<<<<<<<<<<<<

  constructor(private router: Router,private toastr: ToastrService) {
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
        console.log('Begin: UserService > onAuthStateChange = ' + event +' > userAuth = ' + (this.userAuth.value as User).id);

        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event ===  'INITIAL_SESSION') {
          let s = sess;
          if (s != null) {
            var u: User = s.user;
            this.userAuth.next(u);
          }
        } else if (event === 'PASSWORD_RECOVERY') {
        } else {
          this.userAuth.next(false);
        }

        console.log(
          'End: UserService > onAuthStateChange:event= ' + event + ' > userAuth = ' + (this.userAuth.value as User).id
        );
      }
    );

    // Trigger initial session load
    this.loadUser();
  }
}