import { Component } from '@angular/core';
import { IDocs } from 'src/app/services/interfaces/hoa';

@Component({
  selector: 'app-updates',
  templateUrl: './updates.component.html',
  styleUrls: ['./updates.component.scss']
})
export class UpdatesComponent {


  selectPdf(url:string){
    window.open(url, "_blank");
  }

  bylaws:IDocs = {description:"By-Laws Proposed Updates",
  link:"https://micxgqaegkkcwqjjjaqc.supabase.co/storage/v1/object/sign/documents/WST-Proposed-Bylaws.pdf?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJkb2N1bWVudHMvV1NULVByb3Bvc2VkLUJ5bGF3cy5wZGYiLCJpYXQiOjE2OTA4MTY2NDIsImV4cCI6MTcyMjM1MjY0Mn0.s4zIC77v2ewzpNzGFUenrGj7TK8PTWyISDkkZPrSqzw&t=2023-07-31T15%3A17%3A23.185Z"};
}
