import { Injectable } from '@angular/core';
import { Observable, Subject, Subscription, BehaviorSubject } from 'rxjs'
import { createClient, SupabaseClient } from '@supabase/supabase-js';

import { IProfile, IProfileUpdate } from './interfaces/iuser';

import { SupabaseService } from '../services/supabase.service';

import { IWorkOrder, IBasicForm } from './interfaces/iforms';
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

  


  private currentUnit: number;

  

  
  

  

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
      //this.router.navigate(['/home']);
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
      //this.router.navigate(['/home']);
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

  

 

  

  publishUnitData(data) {

    let dataObj = {
      to: 'UnitService',
      event: 'publishUnitData',
      iUnit: data,
    };
    this.sendData(dataObj);
    //! replace with Obsv

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

