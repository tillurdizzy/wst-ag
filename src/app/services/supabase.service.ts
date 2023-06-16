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


    //* >>>>>>>>>>>>>> FORUM <<<<<<<<<<<<<<<<
  async getForumMenu(){
    console.log('SupabaseService > getForumMenu()');
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
    console.log('SupabaseService > getForumTopic()');
    try {
      let { data, error } = await this.supabase.from('forum-topic').select('*').eq('menu_id',topicId)
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

  async getForumPosts(postId:number){
    console.log('SupabaseService > getForumPosts()');
    try {
      let { data, error } = await this.supabase.from('forum-post').select('*').eq('topic_id',postId)
      let dataObj = {
        to: 'ForumService',
        event: 'getForumPosts',
        result: data
      };
      this.sendData(dataObj);
    } catch (error) {
      alert("ERROR: getForumPosts "  + JSON.stringify(error))
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

   

   
  }
}
