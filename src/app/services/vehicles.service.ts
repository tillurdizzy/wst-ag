import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { DialogComponent } from '../library/dialog/dialog.component';
import { ISpaceUpdate, IVehicle, IVehicleTable } from './interfaces/iuser';

@Injectable({
  providedIn: 'root'
})
export class VehiclesService {
  private supabase: SupabaseClient;


  //^vehicles$
  private vehiclesBS: BehaviorSubject<IVehicle[] | boolean> = new BehaviorSubject([]);
  public vehicles$ = this.vehiclesBS.asObservable();

  getVehiclesObs(): Observable<IVehicle[] | boolean> {
    return this.vehicles$
  }

  setVehiclesObs(n:IVehicle[]){
    n.sort((e1, e2) => e1.space > e2.space ? 1 : e1.space < e2.space ? -1 : 0);
    this.vehiclesBS.next(n);
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
        //this.showResultDialog('Vehicle removed.')
      }else{
        //this.showResultDialog('ERROR: ' + JSON.stringify(error))
      }
    } catch (error) {
      //this.showResultDialog('ERROR: ' + JSON.stringify(error))
    }finally{
      //this.router.navigate(['/home']);
      
    }
  };

  async updateParkingSpace(
    space: ISpaceUpdate,
    id: number,
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
     
    }
  };

  async fetchResidentVehicles(unit: number) {
    console.log('VehiclesService > fetchResidentVehicles()');
    try {
      let data = await this.supabase.from('parking').select('*').eq('unit', unit);
      if(data != null && data!=undefined){
        this.processRawVehicleData(data.data);
      }
    } catch (error) {
      this.showResultDialog('ERROR: ' + JSON.stringify(error))
    }
  }

  processRawVehicleData(data){
    let x = data as IVehicle[];
    this.setVehiclesObs(x)
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

  showResultDialog(message:string){
      
    /* 
        setTimeout(() => {
          this.dialogRef.close();
        }, 2000); */
    }

    resetService(){
      this.vehiclesBS.next(false);
    }
  
  constructor() {

    console.log('VehiclesService > constructor() ');
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
