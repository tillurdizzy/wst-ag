import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { ResidentsService } from '../services/residents.service';
import { VehiclesService } from '../services/vehicles.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent {
  constructor(private us: UserService, private rs:ResidentsService, private vs:VehiclesService){
    console.log("HomeComponent >> constructor()")

    //! Comment out !!!
   
   
  }
}
