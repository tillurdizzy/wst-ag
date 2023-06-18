import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { Subject , Subscription} from 'rxjs';
import { IUserAccount, IUserUpdate } from '../services/interfaces/iuser';
import { IProfile, IProfileFetch } from '../services/interfaces/iuser';
import { IVehicle } from '../services/interfaces/iuser';
import { IResidentAccount, IResidentInsert } from '../services/interfaces/iuser';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent {
  userScription: Subscription;
  userAuthenticated:Boolean = false;

  constructor(private us:UserService){
    console.log('UsersComponent > constructor()')
    this.userScription = this.us.getCurrentUser().subscribe(x => {
      if(x != null){
        if(x == false){
          this.userAuthenticated = false;
        }else{
          this.userAuthenticated = true;
        }
      }
      console.log('UsersComponent > this.userAuthenticated = ' + this.userAuthenticated)
    })
  }
}
