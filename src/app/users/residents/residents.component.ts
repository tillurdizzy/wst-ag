import { Component, Input ,OnInit, SimpleChanges} from '@angular/core';
import { IUnit } from 'src/app/services/interfaces/iuser';
//import { DropdownModule } from 'primeng/dropdown';
import { Subscription } from 'rxjs'
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { IResident, IResidentAccount, IResidentInsert } from 'src/app/services/interfaces/iuser';
import { ResidentsService } from 'src/app/services/residents.service';
import { UserService } from 'src/app/services/user.service';
import { VehiclesService } from 'src/app/services/vehicles.service';

@Component({
  selector: 'app-residents',
  templateUrl: './residents.component.html',
  styleUrls: ['./residents.component.scss']
})
export class ResidentsComponent implements OnInit{
  @Input() reset: boolean = false;


    // This sets the display back to data if the user leaves while the form is showing
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['reset'] && changes['reset'].currentValue) {
      this.hideUpdateForm();
    }
  }


  me: string = "ResidentsComponent "
  display:string = 'data'
  subscriptionOne: Subscription;
  subscriptionTwo: Subscription;
  subscriptionThree: Subscription;
  ownerRole:string = 'resident'
  myProfiles: IResidentAccount[] = [{ firstname: '', lastname: '', email: '', cell: '',uuid:'', id:0, alerts:''}];
 
  myUnit: IUnit = { unit:0, street:'',sqft:0, bdrms:1 , bldg:''};
  multiUnits:number[];
  //* Single objects chosen from table to edit
  editProfile: IResidentAccount = { firstname: '', lastname: '', email: '', cell: '', uuid: '', id:0, alerts:''};
  updatedProfiles:IResidentAccount[] = [];
 

  form: FormGroup = new FormGroup({
    firstname: new FormControl ("", Validators.required),
    lastname:  new FormControl("", Validators.required),
    cell: new FormControl ("")
  });


    //^ Valuechange for this form in ngOnInit!
  dropDown: FormGroup = new FormGroup({
    selectedUnit:new FormControl<number>(null)
  });

  ngOnInit(): void {
    this.hideUpdateForm()
    this.dropDown.valueChanges.subscribe(value => {
      console.log('Form value changed:', value);
      this.rs.fetchUnit(value.selectedUnit);
      this.rs.fetchResidentProfiles(value.selectedUnit);
      this.vs.fetchResidentVehicles(value.selectedUnit);
    });
  }
  
  handleChildData(idNum:number){
    this.updatedProfiles = [];
    for (let index = 0; index < this.myProfiles.length; index++) {
      const element = this.myProfiles[index];
      if(element.id == idNum){
        this.editProfile = element;
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

      this.rs.updateResident(formData, this.editProfile.id, this.myUnit.unit)
      this.form.reset(); // Optional: Reset the form after submission
      this.display = 'data'
    }
  }

  removeResident(){
    let formData:IResidentInsert = { firstname: '', lastname: '', email: '', cell: ''};
    this.rs.updateResident(formData, this.editProfile.id, this.myUnit.unit)
    this.form.reset(); // Optional: Reset the form after submission
    this.display = 'data'
  }

  showUpdateForm(){
    console.log(this.me + ">> showUpdateForm()")
    this.form.patchValue(this.editProfile);
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

handleUserAccountObs(x){
  // get units for dropdown
  this.multiUnits = x.units
}

  ngOnDestroy() {
    this.us.clearData();
    this.subscriptionOne.unsubscribe();
    this.subscriptionTwo.unsubscribe();
  };


  constructor(private rs: ResidentsService, private us: UserService, private vs: VehiclesService) {
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

    this.subscriptionThree = this.us.getUserAccount$().subscribe(x => {
      console.log(this.me + ">> getUserAccount$()")
      this.handleUserAccountObs(x);
    })

   
  }
};
