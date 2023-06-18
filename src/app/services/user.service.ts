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
import { IUserAccount } from './interfaces/iuser';


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
     //* Observables
  _session: AuthSession | null = null;
  private currentUser: BehaviorSubject < User | boolean > = new BehaviorSubject(false);
  public currentUser$ = this.currentUser.asObservable();


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

  getCurrentUser(): Observable <User | boolean> {
    return this.currentUser.asObservable();
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
    this.getUserAccount(uid);
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
  }

  async getUserAccount(user: string) {
    console.log('UserService >> getUserAccount()');
    try {
      let { data, error } = await this.supabase.from('accounts').select('*').eq('uuid', user).single();
      if(data != null){
        this.processUserAccount(data)
      }
    } catch (error) {
      alert("Sign in error: getUserAccount "  + JSON.stringify(error))
    }
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
          'End: UserService > onAuthStateChange:event= ' +
            event +
            ' > currentUser = ' +
            (this.currentUser.value as User).id
        );
      }
    );

    // Trigger initial session load
    this.loadUser();
  }
}