import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.scss'],
})
export class FormsComponent implements OnInit {

  formList = ['Work Order','Message to Board','Architectural Request','Violation Report']
  formView:string = null;
  //^ Valuechange for this form in ngOnInit!
  dropDown: FormGroup = new FormGroup({
    form: new FormControl<number>(null),
  });

  ngOnInit(): void {
    this.dropDown.valueChanges.subscribe((value) => {
      console.log('Form value changed:', value);
      this.formView = value.form;
    });
  }
}
