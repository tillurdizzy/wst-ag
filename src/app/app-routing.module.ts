import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { HoaComponent } from './hoa/hoa.component';
import { MeetingsComponent } from './hoa/meetings/meetings.component';
import { MembersComponent } from './hoa/members/members.component';
import { IssuesComponent } from './hoa/issues/issues.component';
import { CommitteesComponent } from './committees/committees.component';
import { LandscapeComponent } from './committees/landscape/landscape.component';
import { EventsComponent } from './committees/events/events.component';
import { BylawsComponent } from './committees/bylaws/bylaws.component';
import { RulesComponent } from './committees/rules/rules.component';
import { HospitalityComponent } from './committees/hospitality/hospitality.component';
import { EventCalendarComponent } from './event-calendar/event-calendar.component';
import { NavErrorComponent } from './library/nav-error/nav-error.component';
import { ExpendituresComponent } from './hoa/expenditures/expenditures.component';
import { DocsComponent } from './hoa/docs/docs.component';
import { UsersComponent } from './users/users.component';


const routes: Routes = [
  {
    path: '', 
    title: 'WST Owners Advocacy Group',
    children: [
      {path:'', redirectTo:'home', pathMatch:'full'},
      {path:'home', component: HomeComponent},
      {path:'hoa', component: HoaComponent,
        children:
          [
            {path:'', redirectTo:'hoa-meetings', pathMatch:'full'},
            {path:'hoa-meetings', component: MeetingsComponent},
            {path:'hoa-expenditures', component: ExpendituresComponent},
            {path:'hoa-issues', component: IssuesComponent},
            {path:'hoa-docs', component: DocsComponent},
            {path:'hoa-members', component: MembersComponent},

          ]},
      {path:'committees', component: CommitteesComponent,
        children:
          [
            {path:'', redirectTo:'committees-landscape', pathMatch:'full'},
            {path:'committees-landscape', component: LandscapeComponent},
            {path:'committees-events', component: EventsComponent},
            {path:'committees-bylaws', component: BylawsComponent},
            {path:'committees-rules', component: RulesComponent},
            {path:'committees-hospitality', component: HospitalityComponent},
  
          ]},
      {path:'calendar', component: EventCalendarComponent},
      {path:'members', component: UsersComponent},
      {path:'events', component: NavErrorComponent },
      {path:'404', component: NavErrorComponent },
      {path:'**', redirectTo: '404',outlet:"app"},
    ]


  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
