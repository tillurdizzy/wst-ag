import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { ResidentsService } from 'src/app/services/residents.service';
import { FormsService } from 'src/app/services/forms.service';
import { Subscription } from 'rxjs'
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { IBasicForm } from 'src/app/services/interfaces/iforms';
import { IUserAccount } from 'src/app/services/interfaces/iuser';

@Component({
  selector: 'app-arch-request',
  templateUrl: './arch-request.component.html',
  styleUrls: ['./arch-request.component.scss']
})
export class ArchRequestComponent {

  subscriptionA: Subscription;
  subscriptionB: Subscription;
  subscriptionC: Subscription;
  private userAccount: IUserAccount = {
    id: 1,username: '',role: '',cell: '',email: '',units: [],uuid: '',residesAt:0,
    firstname: '',lastname: '',csz: '',street: '',alerts: '',member:null};

  locList = ['Front','Back','Side','Carport','Balcony','Roof','Patio','Other']
  formData: IBasicForm = {userid:'', date:'',location:'',cell:'', name:'', email:'',category:'',photo:'',type:'Architectural',text:''}
  

  //^ Valuechange for this form in ngOnInit!
  dropDown: FormGroup = new FormGroup({
    form: new FormControl<number>(null),
  });

  ngOnInit(): void {
    this.dropDown.valueChanges.subscribe((value) => {
      console.log('Form value changed:', value);
     
    });
  }

  myForm: FormGroup = new FormGroup({
    location: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
  });

  submitForm() {
    if (this.myForm.valid) {
      console.log(this.myForm.value); // Perform further actions with the form data
      let form = this.myForm.value;
      this.formData.type = 'Architectural Request'
      //this.formData.userid = this.userAccount.uuid;
      //this.formData.cell = this.userAccount.cell;
      //this.formData.email =  this.userAccount.email;
      //this.formData.name = this.userAccount.firstname + " " + this.userAccount.lastname;
      this.formData.text = form.description;
      this.formData.location = form.location;
    
    //this.supabase.insertBasicForm(this.formData,'Request Submitted');
      this.myForm.reset(); // Optional: Reset the form after submission
      
    }
  }

  constructor(
    private us: UserService,private rs: ResidentsService,private fs:FormsService
  ) {
    console.log('UsersComponent > constructor()');
   
    this.subscriptionA = this.us.getAuth$().subscribe((x) => {
      console.log('UsersComponent > subscription >> getAuth$()' + x);
      if (x != null) {
        //this.handleUser$(x);
      }
    });

    this.subscriptionB = this.us.getUserAccount$().subscribe((x) => {
      console.log('UsersComponent > subscription >> getUserAccount$()' + x);
      //this.handleAccount$(x);
    });
  }

}
