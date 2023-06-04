import { Component, OnInit } from '@angular/core';
import { IDocs } from 'src/app/services/interfaces/hoa';

@Component({
  selector: 'app-docs',
  templateUrl: './docs.component.html',
  styleUrls: ['./docs.component.scss']
})
export class DocsComponent implements OnInit{
  docs:IDocs[] = [];
  bylaws:IDocs = {description:"By-Laws of Westbury Square Townhomes, 1978",link:"https://micxgqaegkkcwqjjjaqc.supabase.co/storage/v1/object/sign/documents/WST-Bylaws.pdf?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJkb2N1bWVudHMvV1NULUJ5bGF3cy5wZGYiLCJpYXQiOjE2ODU4NjQ0MTUsImV4cCI6MTcxNzQwMDQxNX0.LfKXU6_iEhqB6d0tdOlYV5wRQQTSSynrFklRYXCXQn4&t=2023-06-04T07%3A40%3A15.334Z"};
  rr:IDocs = {description:"Rules and Regulations, Amended 2012",link:"https://micxgqaegkkcwqjjjaqc.supabase.co/storage/v1/object/sign/documents/Rules&Regs.pdf?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJkb2N1bWVudHMvUnVsZXMmUmVncy5wZGYiLCJpYXQiOjE2ODU4NjQ4MDQsImV4cCI6MTcxNzQwMDgwNH0.t5fwGYmHQYM8fen3_dxSwA2ipo-oKTNJ6c2Aa4MgOJM&t=2023-06-04T07%3A46%3A45.156Z"};
  acc:IDocs = {description:"Architectural Committee Request Form",link:"https://micxgqaegkkcwqjjjaqc.supabase.co/storage/v1/object/sign/documents/ACC.pdf?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJkb2N1bWVudHMvQUNDLnBkZiIsImlhdCI6MTY4NTg2NDgxOSwiZXhwIjoxNzE3NDAwODE5fQ.P_vncgFvsfAzaL7XYE6YHyde3To7esrqd2AQlTsR4Qw&t=2023-06-04T07%3A47%3A00.176Z"};
  dba:IDocs = {description:"Harris County DBA, 2014",link:"https://micxgqaegkkcwqjjjaqc.supabase.co/storage/v1/object/sign/documents/DBA.pdf?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJkb2N1bWVudHMvREJBLnBkZiIsImlhdCI6MTY4NTg2NDgzNiwiZXhwIjoxNzE3NDAwODM2fQ.2EU7hIRAIuAlerYARp1G1nP6vt1wdfpfp8Viy7b1CNw&t=2023-06-04T07%3A47%3A16.962Z"};
  inc:IDocs = {description:"Articles of Incorportion, 1978",link:"https://micxgqaegkkcwqjjjaqc.supabase.co/storage/v1/object/sign/documents/Incorporation.pdf?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJkb2N1bWVudHMvSW5jb3Jwb3JhdGlvbi5wZGYiLCJpYXQiOjE2ODU4ODU0OTUsImV4cCI6MTcxNzQyMTQ5NX0.Mw6_gvhB6xXcWx75UJYntcheNfIUzI6eESIq6l-XYNA&t=2023-06-04T13%3A31%3A35.370Z"};
  dec:IDocs = {description:"Condominium Declaration",link:"https://micxgqaegkkcwqjjjaqc.supabase.co/storage/v1/object/sign/documents/Declaration.pdf?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJkb2N1bWVudHMvRGVjbGFyYXRpb24ucGRmIiwiaWF0IjoxNjg1ODg1NTExLCJleHAiOjE3MTc0MjE1MTF9.jho0k8kEK7mmHP9HWm3jiNE1PTiDd3kQTa-XqsBG7ME&t=2023-06-04T13%3A31%3A52.220Z"};
  condo:IDocs = {description:"Amended Condominium Declaration",link:"https://micxgqaegkkcwqjjjaqc.supabase.co/storage/v1/object/sign/documents/AmendCondoDec.pdf?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJkb2N1bWVudHMvQW1lbmRDb25kb0RlYy5wZGYiLCJpYXQiOjE2ODU4ODU1MjcsImV4cCI6MTcxNzQyMTUyN30._Dl2tYagSlWrf2dTvExILYMozqUUUJ6sMzua7PS6XzQ&t=2023-06-04T13%3A32%3A07.917Z"};
  welcome:IDocs = {description:"Welcome Packet",link:"https://micxgqaegkkcwqjjjaqc.supabase.co/storage/v1/object/sign/documents/Welcome%20Packet.pdf?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJkb2N1bWVudHMvV2VsY29tZSBQYWNrZXQucGRmIiwiaWF0IjoxNjg1ODg1NTQ0LCJleHAiOjE3MTc0MjE1NDR9.DpwVENONCPJDcP349RWIDPkKVo9bBUsO8tI7o0_vgUk&t=2023-06-04T13%3A32%3A24.454Z"};
  map:IDocs = {description:"Property Map",link:"https://micxgqaegkkcwqjjjaqc.supabase.co/storage/v1/object/sign/documents/WST-Map.pdf?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJkb2N1bWVudHMvV1NULU1hcC5wZGYiLCJpYXQiOjE2ODU4ODU1NTgsImV4cCI6MTcxNzQyMTU1OH0.I_A3CXAqOJz_k7x_A44m_6RCUElKf7d8IeupBp0t294&t=2023-06-04T13%3A32%3A38.858Z"};


  ngOnInit(): void {
   this.docs.push(this.bylaws);
   this.docs.push(this.rr);
   this.docs.push(this.inc);
   this.docs.push(this.dba);
   this.docs.push(this.dec);
   this.docs.push(this.condo);
   this.docs.push(this.acc);
   this.docs.push(this.welcome);
   this.docs.push(this.map);
  }

  selectPdf(url:string){
    window.open(url, "_blank");
  }
}


