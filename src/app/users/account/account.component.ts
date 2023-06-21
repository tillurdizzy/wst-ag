import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { Subscription } from 'rxjs';
import { IUserAccount } from 'src/app/services/interfaces/iuser';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})

export class AccountComponent implements OnInit{
  subscription: Subscription;
  userAccount:IUserAccount = { id:0, username: '', role: '', cell: '', email: '', units: [], uuid:'' ,firstname:'',lastname:'',csz:'',street:'',alerts:''};
  unitCount:number = 0;

  ngOnInit(): void {
   
  }

  updateUserAccount(){
    //this.router.navigate(['/forms/user-update']);
  }

  handleUserAccountObs(x){
    this.userAccount = x;
    //this.unitCount = this.userAccount.units.length;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  constructor(private us: UserService, private router: Router) {
    this.subscription = this.us.getUserAccount$().subscribe(x => {
      this.handleUserAccountObs(x);
    })
  }

}
