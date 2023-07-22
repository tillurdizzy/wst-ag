import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { ResidentsService } from '../services/residents.service';
import { VehiclesService } from '../services/vehicles.service';
import { Subscription } from 'rxjs';
import { IUserAuth } from '../services/interfaces/iuser';
import { IUserAccount } from '../services/interfaces/iuser';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent {
  selectedTab: string = '';
  onTabChange(event: any): void {
    this.selectedTab = event.originalEvent.target.innerText.trim();
  }
  subscriptionA: Subscription;
  subscriptionB: Subscription;
  subscriptionC: Subscription;
  private userAccount: IUserAccount = {
    id: 1,username: '',role: '',cell: '',email: '',units: [],uuid: '',
    firstname: '',lastname: '',csz: '',street: '',alerts: '',};

  user: IUserAuth = { id: '', aud: '', role: '', email: '' };
  userAuthenticated: Boolean = false;

  handleUser$(x) {
    if (x == false) {
      this.userAuthenticated = false;
    } else {
      this.user.id = x.id;
      this.user.email = x.email;
      this.user.aud = x.aud;
      this.user.role = x.role;
      this.userAuthenticated = true;
      console.log('UsersComponent > handleUser$() = ' + x);
      this.us.fetchUserAccount(this.user.id);
    }
    console.log('UsersComponent > handleUser() = ' + this.userAuthenticated);
  }

  // userAccount
  // this defaults to id = 1
  // UserService de3faults to id = 0
  handleAccount$(x: IUserAccount ) {
    console.log('UsersComponent > handleAccount$() id = ' + x.id);
    if(this.userAccount.id == 1 && x.id == 0){
      // this would be the initial run when component created it subscribes to userAccount$ but no account has been retrieved yet
      // dont do anything just let it pass
    }else if(this.userAccount.id == 1 && x.id > 0){
     // now we have real account
      this.userAccount = x;
      let units = this.userAccount.units;
      //^ Roles amd multiunit owners
      if(units.length > 1){
        if(this.user.role == "admin" || this.user.role == "non-resident"){
          // continue but init unit selector
        }else if(this.user.role == "resident +"){
          // 
        }
      }

      //! Fetch Unit, Residents and Vehicles
      console.log('UsersComponent > Fetch Unit, Residents and Vehicles');
      this.rs.fetchUnit(units[0]);
      this.rs.fetchResidentProfiles(units[0]);
      this.vs.fetchResidentVehicles(units[0]);
    }else{
      // this means we are updating ... just set userAccount but don't call all the other fetches
      this.userAccount = x;
    }
  }

  isIUserAccount(obj: any): obj is IUserAccount {
    return (obj as IUserAccount).id !== undefined;
  }

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

  ngOnDestroy(): void {
    this.subscriptionA.unsubscribe();
    this.subscriptionB.unsubscribe();
  }

  constructor(
    private us: UserService,
    private rs: ResidentsService,
    private vs: VehiclesService
  ) {
    console.log('UsersComponent > constructor()');
    this.userAuthenticated = false;
    this.subscriptionA = this.us.getAuth$().subscribe((x) => {
      console.log('UsersComponent > subscription >> getAuth$()' + x);
      if (x != null) {
        this.handleUser$(x);
      }
    });

    this.subscriptionB = this.us.getUserAccount$().subscribe((x) => {
      console.log('UsersComponent > subscription >> getUserAccount$()' + x);
      this.handleAccount$(x);
    });
  }
}
