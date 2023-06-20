import { Component, OnInit} from '@angular/core';
import { IUnit } from 'src/app/services/interfaces/iuser';
import { IVehicle } from 'src/app/services/interfaces/iuser';
import { Subscription } from 'rxjs'
import { Router } from '@angular/router'
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
  subscriptionOne: Subscription;
  subscriptionTwo: Subscription;
  ownerRole:string = 'resident'
  myProfiles: IResidentAccount[] = [{ firstname: '', lastname: '', email: '', cell: '',uuid:'', id:0, alerts:''}];
 
  myUnit: IUnit = { unit:100, street:'',sqft:0, bdrms:1 , bldg:''};

  //* Single objects chosen from table to edit
  editProfile: IResidentAccount = { firstname: 'x', lastname: 'x', email: '', cell: 'x', uuid: '', id:0, alerts:''};
 

  ngOnInit(): void {
    console.log(this.me + " ngOnInit()")
    //this.ownerRole = this.us.getOwnerRole();
    //let u = this.rs.getCurrentUnit;
    //this.fs.unitSelectionHandler(u)
  }

  onResidentClick(n: number) {
    console.log(this.me + " onResidentClick() = " + n)
    this.editProfile = this.myProfiles[n];
    //this.rs.setSelectedProfile(this.editProfile);
    //this.router.navigate(['/units/edit-resident']);
  };

//* >>>>>>>>>>>>  SUBSCRIPTION HANDLERS  >>>>>>>>>>>>\\

private processProfiles(data:any){
  console.log(this.me + " processProfiles()")
  if(data == null){return}
  //this.resetTableData()
  this.myProfiles = [];
  for (let index = 0; index < data.length; index++) {
    let p:IResidentAccount = { firstname: '', lastname: '', email: '', cell: '', uuid: '', id:0, alerts:''};
    const element = data[index];
    p.firstname = element.firstname;
    p.lastname = element.lastname;
    p.email = element.email;
    p.cell = element.cell;
    p.uuid = element.uuid;
    p.id = element.id;
    p.alerts = element.alerts;
   
    let clone = structuredClone(p);
    this.myProfiles.push(clone);
  }
 
  if(this.ownerRole == 'resident'){
    //this.residentEditStates.residentOne = false;
  }
}



  ngOnDestroy() {
    this.us.clearData();
    this.subscriptionOne.unsubscribe();
    this.subscriptionTwo.unsubscribe();
  };


  constructor(private router: Router, 
    private rs: ResidentsService, private us: UserService) {

    this.subscriptionOne = this.rs.getResidentsObs().subscribe((x:IResidentAccount[]) =>  {
      console.log(this.me + '>> getResidentsObs()')
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
