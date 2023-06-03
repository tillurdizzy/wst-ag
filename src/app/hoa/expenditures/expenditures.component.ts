import { Component, OnInit } from '@angular/core';
import { IExpenditures } from 'src/app/services/interfaces/hoa';

@Component({
  selector: 'app-expenditures',
  templateUrl: './expenditures.component.html',
  styleUrls: ['./expenditures.component.scss']
})
export class ExpendituresComponent implements OnInit{
  expenses:IExpenditures[] = [];
  obj:IExpenditures = {date:"June 1, 2023",description:"Replace roof on Unit 227",amount:"$5000",category:"Maintenance/Roof"}

  ngOnInit(): void {
   this.expenses.push(this.obj)
  }

}
