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
  link:"https://micxgqaegkkcwqjjjaqc.supabase.co/storage/v1/object/sign/documents/WST-Proposed-Bylaws.pdf?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJkb2N1bWVudHMvV1NULVByb3Bvc2VkLUJ5bGF3cy5wZGYiLCJpYXQiOjE2OTIxMTc3NzQsImV4cCI6MTcyMzY1Mzc3NH0.FwDb-Bjdrdk-1TS0k39w5g3DdF9j8gZx3vPbURMU60A&t=2023-08-15T16%3A42%3A55.031Z"};
}
