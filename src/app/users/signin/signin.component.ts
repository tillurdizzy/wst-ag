import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators,FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from 'src/app/services/supabase.service';
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

 

  ngOnInit() {
    this.myForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    const username = this.myForm.get('email').value;
    const password = this.myForm.get('password').value;
  };

  callSupabase(obj) {
    if (this.loginMode == 'IN') {
      this.supabase.signIn(obj);
    } else if(this.loginMode == 'UP'){
      this.supabase.signUp(obj);
    }else if(this.loginMode == 'PW'){
      this.supabase.resetPassword(obj.email);
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
    private supabase: SupabaseService,
    private router: Router,
    private userService: UserService
  ) {}
}
