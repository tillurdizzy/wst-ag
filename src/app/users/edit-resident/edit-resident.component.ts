
import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms'
import { Router } from '@angular/router'
import { Subscription } from 'rxjs';
import { SupabaseService } from '../../services/supabase.service'
import { UserService } from 'src/app/services/user.service';
import { ResidentsService } from 'src/app/services/residents.service';
import { IProfileUpdate } from 'src/app/services/interfaces/iuser';

@Component({
  selector: 'app-edit-resident',
  templateUrl: './edit-resident.component.html',
  styleUrls: ['./edit-resident.component.scss']
})
export class EditResidentComponent {
  me = "EditResidentComponent";

  supaSubscription: Subscription

  myProfile: IProfileUpdate;
  profileID:number;

  myForm = new FormGroup({
    email: new FormControl(''),
    firstname: new FormControl('', Validators.required),
    lastname: new FormControl(''),
    cell: new FormControl(''),
  });


  // * >>>>>>>>>>>>>>>>>>>>  Methods <<<<<<<<<<<<<<<<<<<<<<<<<<<<

  ngOnInit() {
    console.log(this.me + " ngOnInit()")
    //this.myProfile = this.removeNull(this.rs.getSelectedProfile());
    //this.profileID = this.rs.getUpdateProfileID()
    this.myForm.reset();
    this.setFormValues();
  };

  cancelBackBtn(){
    this.router.navigate(['/home']);
  }

  setFormValues() {
    if (this.myProfile != undefined) {
      var p: IProfileUpdate =
      {
        email: this.myProfile.email,
        firstname: this.myProfile.firstname,
        lastname: this.myProfile.lastname,
        cell: this.myProfile.cell,
       
      };
      this.myForm.setValue(p);
    }
  };


//* >>>>>>>>>>>  BUTTON HANDLERS  <<<<<<<<<<<<
  submitBtn() {
    var f = this.myForm.value;
    this.myProfile = {
      email: f.email, 
      cell: f.cell, 
      firstname: f.firstname,
      lastname: f.lastname
    };
    console.log(this.me + " submitBtn()")
    this.updateResidentProfile()
  };

  submitBtnDelete(){
    //let unitNumber = this.rs.getCurrentUnit();
    //this.supabase.deleteProfile(this.profileID);
  }

  updateResidentProfile() {
    console.log(this.me + " > updateResidentProfile()")
    //let id = this.rs.getResidentID();
    //this.supabase.updateProfile(this.myProfile, id);
  };

  //* >>>>>>>>>>>  UTILITIES  <<<<<<<<<<<<

  removeNull(obj) {
    if(obj == undefined){return}
    Object.keys(obj).forEach(k => {
      if (obj[k] === null || obj[k] === undefined) {
        obj[k] = '';
      }
    });
    return obj;
  };

  public handleError = (control: string, error: string) => {
    return this.myForm.controls[control].hasError(error);
  };


  constructor(private router: Router, private supabase: SupabaseService, 
    private us: UserService, private rs:ResidentsService) {

    this.supaSubscription = this.supabase.getData().subscribe(x => {
      if (x == null) { return };

      let dataPassed = x;
      let f = dataPassed.to;
      let ar = f.split(',');
      if(ar.indexOf("UpdateResidentComponent")> -1){

        if ((dataPassed.from == 'SupabaseService') && (dataPassed.event == 'updateResidentProfile success!')) {
          console.log(this.me + 'supaSubscription > updateResidentProfile success!')
          

        } else if ((dataPassed.from == 'SupabaseService') && (dataPassed.event == 'delete_adminResident')) {
          console.log(this.me + 'supaSubscription > delete Profile success!!')
         

        } else if (dataPassed.from == '' && dataPassed.event == '') {

        }
      }
    });
  }
}