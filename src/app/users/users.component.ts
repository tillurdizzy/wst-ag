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
  subscriptionA: Subscription;
  subscriptionB: Subscription;
  subscriptionC: Subscription;
  private userAccount: IUserAccount | boolean = {
    id: 0,
    username: '',
    role: '',
    cell: '',
    email: '',
    units: [],
    uuid: '',
    firstname: '',
    lastname: '',
    csz: '',
    street: '',
    alerts: '',
  };

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
      this.us.fetchUserAccount(this.user.id);
    }

    console.log('UsersComponent > handleUser() = ' + this.userAuthenticated);
  }

  handleAccount$(x: IUserAccount | boolean) {
    console.log('UsersComponent > handleAccount$() = ' + x);
    if (this.isIUserAccount(x)) {
      this.userAccount = x;
      let units = this.userAccount.units;
      //! Fetch Unit, Residents and Vehicles
      this.rs.fetchUnit(units[0]);
      this.rs.fetchResidentProfiles(units[0]);
      this.vs.fetchResidentVehicles(units[0]);
    } else {
      
    }
  }

  isIUserAccount(obj: any): obj is IUserAccount {
    return (obj as IUserAccount).id !== undefined;
  }

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
      console.log('UsersComponent > getAuth$()' + x);
      if (x != null) {
        this.handleUser$(x);
      }
    });

    this.subscriptionB = this.us.getUserAccount$().subscribe((x) => {
      this.handleAccount$(x);
    });
  }
}
