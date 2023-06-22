import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Subscription } from 'rxjs';
import { IUserAccount, IUserUpdate } from 'src/app/services/interfaces/iuser';
import { ReactiveFormsModule, FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})

export class AccountComponent implements OnInit{
  subscription: Subscription;
  userAccount:IUserAccount = { id:0, username: '', role: '', cell: '', email: '', units: [], uuid:'' ,firstname:'',lastname:'',csz:'',street:'',alerts:''};
  unitCount:number = 0;
  display:string = 'data';
  form!: FormGroup;

  ngOnInit(): void {
   
  }

  submitForm() {
    if (this.form.valid) {
      console.log(this.form.value); // Perform further actions with the form data
      let formData = this.form.value;
      let updateObj:IUserUpdate = {firstname:'',lastname:'',csz:'',street:'', cell:''}

      //this.us.updateUserAccount(obj, id)
      this.form.reset(); // Optional: Reset the form after submission
    }
  }

  showUpdateForm(){
    this.form = this.formBuilder.group({
      firstName: [this.userAccount.firstname, Validators.required],
      lastName: [this.userAccount.lastname, Validators.required],
      street: [this.userAccount.street, Validators.required],
      city: [this.userAccount.csz, Validators.required],
      cell: [this.userAccount.cell, Validators.required],
      email: [this.userAccount.email, [Validators.required, Validators.email]]
    });
    this.display = 'form'
  }
  hideUpdateForm(){
    this.display = 'data'
  }


  handleUserAccountObs(x){
    this.userAccount = x;
    //this.unitCount = this.userAccount.units.length;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  constructor(private us: UserService, private formBuilder: FormBuilder) {
    this.subscription = this.us.getUserAccount$().subscribe(x => {
      this.handleUserAccountObs(x);
    })
  }

}
