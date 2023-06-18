import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators,FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})

export class SigninComponent {

  loginMode = "IN"
  pageTitle:string = "Sign In"
  buttonLabel = "Sign In"
  myForm: FormGroup;
  value:string;
  //! Default password : 'wstadmin'
  //! for ME personally wstadmin9954
 

  ngOnInit() {
   
    console.log("SigninComponent >> ngOnInit()")
   
    this.myForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    const email = this.myForm.get('email').value;
    const password = this.myForm.get('password').value;
    let obj = {'email':email,'password':password}
    this.callSupabase(obj)
  };

  callSupabase(obj) {
    if (this.loginMode == 'IN') {
      this.userService.signIn(obj);
    } else if(this.loginMode == 'UP'){
      this.userService.signUp(obj);
    }else if(this.loginMode == 'PW'){
      this.userService.resetPassword(obj.email);
    }
    this.myForm.reset();
  }

  changePassword(){
    this.loginMode = "PW"
    this.pageTitle = "Reset Password"
    this.buttonLabel = "Submit"
  }

  public handleError = (control: string, error: string) => {
    //return this.myForm.controls[control].hasError(error);
  };

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService
  ) {}
}
