import { Component } from '@angular/core';
import { Subscription } from 'rxjs'
import { FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent {

  form: FormGroup = new FormGroup({
    firstname: new FormControl ("", Validators.required),
    lastname:  new FormControl("", Validators.required),
    cell: new FormControl ("")
  });

  submitForm() {
    if (this.form.valid) {
      console.log(this.form.value); // Perform further actions with the form data
      this.form.reset(); // Optional: Reset the form after submission
      
    }
  }
}
