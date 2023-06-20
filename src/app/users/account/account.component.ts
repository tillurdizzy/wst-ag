import { Component, OnInit } from '@angular/core';
import { FormsService } from 'src/app/services/forms.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { Subscription } from 'rxjs';
import { IUserAccount } from 'src/app/services/interfaces/iuser';
import { IResidentAccount } from 'src/app/services/interfaces/iuser';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit{
  subscription: Subscription;
  userAuthenticated:boolean = false;
  userAccount:IUserAccount = { id:0, username: '', role: '', cell: '', email: '', units: [], uuid:'' ,firstname:'',lastname:'',csz:'',street:'',alerts:''};
 
  unitCount:number = 0;

  ngOnInit(): void {
    let storedData = this.us.isUserAuthenticated();
    // Before LogIn these will be filled with empty "init" data
    // Auth will be false and unitCount 0
    this.userAuthenticated = storedData.auth;
    this.userAccount = storedData.account;
    this.unitCount = this.userAccount.units.length;
    
  }

  updateUserAccount(){
    //this.router.navigate(['/forms/user-update']);
  }

  constructor(private us: UserService, private fs: FormsService, private router: Router) {}

}
