import { Component, OnInit } from '@angular/core';
import { IUnit } from 'src/app/services/interfaces/iuser';
import { IVehicle } from 'src/app/services/interfaces/iuser';
import { Subscription } from 'rxjs'
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { IResident, IResidentAccount, IResidentInsert } from 'src/app/services/interfaces/iuser';
import { ResidentsService } from 'src/app/services/residents.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-residents',
  templateUrl: './residents.component.html',
  styleUrls: ['./residents.component.scss']
})
export class ResidentsComponent {
  me: string = "ResidentsComponent "
  display:string = 'data'
  form!: FormGroup;
  subscriptionOne: Subscription;
  subscriptionTwo: Subscription;
  ownerRole:string = 'resident'
  myProfiles: IResidentAccount[] = [{ firstname: '', lastname: '', email: '', cell: '',uuid:'', id:0, alerts:''}];
 
  myUnit: IUnit = { unit:0, street:'',sqft:0, bdrms:1 , bldg:''};

  //* Single objects chosen from table to edit
  editProfile: IResidentAccount = { firstname: 'x', lastname: 'x', email: '', cell: 'x', uuid: '', id:0, alerts:''};
  updatedProfiles:IResidentAccount[] = [];
 

  ngOnInit(): void {
    console.log(this.me + " ngOnInit()")
  }

  handleChildData(idNum:number){
    this.updatedProfiles = [];
    for (let index = 0; index < this.myProfiles.length; index++) {
      const element = this.myProfiles[index];
      if(element.id == idNum){
        this.editProfile = element;
      }else{
        this.updatedProfiles.push(element);
      }
     
      this.showUpdateForm()
    }
  }

  submitForm() {
    if (this.form.valid) {
      console.log(this.form.value); // Perform further actions with the form data
      let formData:IResidentInsert = this.form.value;
      this.editProfile.firstname = formData.firstname;
      this.editProfile.lastname= formData.lastname;
      this.editProfile.cell = formData.cell;
      this.editProfile.email= formData.email;
      this.updatedProfiles.push(this.editProfile);

      this.rs.updateResident(formData, this.editProfile.id, this.updatedProfiles)
      this.form.reset(); // Optional: Reset the form after submission
      this.display = 'data'
    }
  }

  showUpdateForm(){
    this.form = this.formBuilder.group({
      firstName: [this.editProfile.firstname, Validators.required],
      lastName: [this.editProfile.lastname, Validators.required],
      cell: [this.editProfile.cell, Validators.required],
      email: [this.editProfile.email, [Validators.required, Validators.email]]
    });
    this.display = 'form'
  }


  hideUpdateForm(){
    this.display = 'data'
  }

//* >>>>>>>>>>>>  SUBSCRIPTION HANDLERS  >>>>>>>>>>>>\\

private processProfiles(data:any){
  console.log(this.me + " processProfiles()")
  if(data == null){return}
  this.myProfiles = data
 
  if(this.ownerRole == 'resident'){
    //this.residentEditStates.residentOne = false;
  }
}

  ngOnDestroy() {
    this.us.clearData();
    this.subscriptionOne.unsubscribe();
    this.subscriptionTwo.unsubscribe();
  };


  constructor(private rs: ResidentsService, private us: UserService, private formBuilder: FormBuilder) {
      console.log(this.me + " constructor()")
    this.subscriptionOne = this.rs.getResidentsObs().subscribe((x:IResidentAccount[]) =>  {
      console.log(this.me + '>> getResidentsObs() count =' + x.length)
      if(x.length > 0){
        this.processProfiles(x);
      }
    });

    this.subscriptionTwo = this.rs.getUnitObs().subscribe((x:IUnit) =>  {
      this.myUnit = x;
      console.log(this.me + '>> getUnitObs = ' + this.myUnit.unit + " sqft = " + this.myUnit.sqft)
    });

   
  }
};
