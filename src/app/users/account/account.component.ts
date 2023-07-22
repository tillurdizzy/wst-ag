import { Component, OnInit, Input , SimpleChanges } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Subscription } from 'rxjs';
import { IUserAccount, IUserUpdate } from 'src/app/services/interfaces/iuser';
import { FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})

export class AccountComponent implements OnInit {
  @Input() reset: boolean = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['reset'] && changes['reset'].currentValue) {
      this.hideUpdateForm();
    }
  }
  subscription: Subscription;
  userAccount:IUserAccount = { id:0, username: '', role: '', cell: '', email: '', units: [], uuid:'' ,firstname:'',lastname:'',csz:'',street:'',alerts:''};
  unitCount:number = 0;
  display:string = 'data';
  form: FormGroup = new FormGroup({
    firstname: new FormControl ("", Validators.required),
    lastname:  new FormControl("", Validators.required),
    street: new FormControl ("", Validators.required),
    csz: new FormControl ("", Validators.required),
    cell: new FormControl ("", Validators.required)
  });

  ngOnInit(): void {
    this.hideUpdateForm()
  }



  submitForm() {
    console.log("AccountComponent >> submitForm()")
    if (this.form.valid) {
      console.log(this.form.value); // Perform further actions with the form data
      let formData = this.form.value as IUserUpdate;
      let updateObj:IUserUpdate = {firstname:'',lastname:'',csz:'',street:'', cell:''};
      let uuid = this.userAccount.uuid;
      this.us.updateUserAccount(formData, uuid)
    }
  }

  showUpdateForm(){
    console.log("AccountComponent >> showUpdateForm()")
    this.form.patchValue(this.userAccount);
    this.display = 'form'
  }

  hideUpdateForm(){
    console.log("AccountComponent >> hideUpdateForm()")
    this.form.reset(); // Optional: Reset the form after submission
    this.display = 'data';
  }


  handleUserAccountObs(x){
    console.log("AccountComponent >> handleUserAccountObs()")
    if(x!=false){
      this.userAccount = x;
    }
   
    //this.unitCount = this.userAccount.units.length;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  constructor(private us: UserService) {
    console.log('AccountComponent >> constructor() ');
    this.subscription = this.us.getUserAccount$().subscribe(x => {
      console.log("AccountComponent >> getUserAccount$()")
      this.hideUpdateForm()
      this.handleUserAccountObs(x);
    })
  }

}
