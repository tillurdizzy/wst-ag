import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { AuthChangeEvent, AuthSession } from '@supabase/supabase-js';
import { Session, User } from '@supabase/supabase-js';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DialogComponent } from '../library/dialog/dialog.component';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;
  dialogRef: DynamicDialogRef;


  async getForumMenu(){
    try {
      let { data, error } = await this.supabase.from('forum-menu').select('*')
      let dataObj = {
        to: 'ForumService',
        event: 'getForumMenu',
        result: data
      };
      this.sendData(dataObj);
    } catch (error) {
      alert("ERROR: getForumMenu  "  + JSON.stringify(error))
    }
  }

  async getForumTopic(topicId:number){
    try {
      let { data, error } = await this.supabase.from('forum-topic').select('*').eq('id',topicId)
      let dataObj = {
        to: 'ForumService',
        event: 'getForumTopic',
        result: data
      };
      this.sendData(dataObj);
    } catch (error) {
      alert("ERROR: getForumTopic "  + JSON.stringify(error))
    }
  }






  //* >>>>>>>>>>>>>> MESSENGER <<<<<<<<<<<<<<<<

  private subject = new Subject<any>();
  public sendData(message: any) {
    console.log('SupabaseService > sendData >  to:' +message.to +' event:' +message.event);
    this.subject.next(message);
  }
  clearData() {this.subject.next(null);}
  getData(): Observable<any> {return this.subject.asObservable();}
  publishData(to: string, event: string, data: any) {
    let dataObj = {to: to, event: event, data: data};
    this.sendData(dataObj);}


  showResultDialog(message: string) {
    this.dialogRef = this.dialogService.open(DialogComponent, {
      data: {message:message},
      header: 'Result',
      width: '40%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: false,
      closable:false
    });

    setTimeout(() => {
      this.dialogRef.close();
    }, 2000);
  }

  //* AUTH
  _session: AuthSession | null = null;
  private currentUser: BehaviorSubject<User | boolean> = new BehaviorSubject(
    false
  );
  public currentUser$ = this.currentUser.asObservable();

  async signIn(credentials: { email: string; password: string }) {
    console.log('Supabase > signIn() ' + JSON.stringify(credentials));
    try {
      var result = await this.supabase.auth.signInWithPassword(credentials);
      if (result.data.user == null) {
        throw result.error.message;
      }
      let dataObj = {
        to: 'DataService',
        event: 'userAuthenticated',
        result: result,
      };
      this.sendData(dataObj);
    } catch (error) {
      alert('Error: ' + JSON.stringify(error));
    }
  }

  async signUp(credentials: { email: string; password: string }) {
    console.log('Supabase > signUp()' + JSON.stringify(credentials));
    try {
      var result = await this.supabase.auth.signUp(credentials);
      if (result.data.user == null) {
        throw result.error.message;
      } else {
        this.showResultDialog('User created: ' + result.data.user.id);
      }
    } catch (error) {
      this.showResultDialog('Error: ' + error);
    }
  }

  authChanges(
    callback: (event: AuthChangeEvent, session: Session | null) => void
  ) {
    console.log('SupabaseService > authChanges() ');
    return this.supabase.auth.onAuthStateChange(callback);
  }

  signOut() {
    return this.supabase.auth.signOut();
  }

  // Password Reset... this called first with only Email to initiate change
  async resetPassword(email: string) {
    try {
      const { data, error } = await this.supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: 'http://localhost:4200/password-reset',
        }
      );
      if (error == null) {
        this.showResultDialog('Check your email for Password Reset link.');
      }
    } catch (error) {
      this.showResultDialog('ERROR: ' + JSON.stringify(error));
    } finally {
      this.router.navigate(['/home']);
    }
  }

  // Actual Password Update
  async updatePassword(new_password: string) {
    try {
      const { data, error } = await this.supabase.auth.updateUser({
        password: new_password,
      });
      if (error == null) {
        this.showResultDialog('Password reset.  Please log in.');
      }
    } catch (error) {
    } finally {
      this.router.navigate(['/home']);
    }
  }

  //* >>>>>>>>>>>>>>>>>>> USER / AUTH / SESSION / ACCOUNT <<<<<<<<<<<<<<<<<<<<<<<

  async loadUser() {
    if (this.currentUser.value) {
      // User is already set, no need to do anything else
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

  getCurrentUser(): Observable<User | boolean> {
    return this.currentUser.asObservable();
  }

  getCurrentUserId(): string {
    if (this.currentUser.value) {
      return (this.currentUser.value as User).id;
    } else {
      return '';
    }
  }

  get session() {
    this.supabase.auth.getSession().then(({ data }) => {
      this._session = data.session;
    });
    return this._session;
  }

  constructor(private router: Router, public dialogService: DialogService) {
    console.log('SupabaseService > constructor() ');
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
        console.log(
          'Begin: SupabaseService > onAuthStateChange = ' +
            event +
            ' > currentUser = ' +
            (this.currentUser.value as User).id
        );

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
          'End: SupabaseService > onAuthStateChange:event= ' +
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
