import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent {


  form: FormGroup = new FormGroup({
    pword: new FormControl<string>('', [Validators.required, Validators.minLength(8)]),
   
  });

  onSubmitPassword(){
    if (this.form.valid) {
      const password = this.form.get('pword').value;
      this.us.updatePassword(password);
    }
  };

  constructor(
    private router: Router,
    private us: UserService
  ) {}
}
