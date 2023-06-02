import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { TopbarMenuComponent } from './topbar-menu/topbar-menu.component';
import { HomeComponent } from './home/home.component';
import { HoaComponent } from './hoa/hoa.component';
import { MeetingsComponent } from './hoa/meetings/meetings.component';
import { MembersComponent } from './hoa/members/members.component';
import { IssuesComponent } from './hoa/issues/issues.component';
import { SigninComponent } from './home/signin/signin.component';
import { PasswordResetComponent } from './home/password-reset/password-reset.component';
import { CommitteesComponent } from './committees/committees.component';
import { LandscapeComponent } from './committees/landscape/landscape.component';
import { EventsComponent } from './committees/events/events.component';
import { BylawsComponent } from './committees/bylaws/bylaws.component';
import { RulesComponent } from './committees/rules/rules.component';
import { NavErrorComponent } from './library/nav-error/nav-error.component';
import { HospitalityComponent } from './committees/hospitality/hospitality.component';
import { DialogComponent } from './library/dialog/dialog.component';
import { EventCalendarComponent } from './event-calendar/event-calendar.component';

@NgModule({
  declarations: [
    AppComponent,
    TopbarMenuComponent,
    HomeComponent,
    HoaComponent,
    MeetingsComponent,
    MembersComponent,
    IssuesComponent,
    SigninComponent,
    PasswordResetComponent,
    CommitteesComponent,
    LandscapeComponent,
    EventsComponent,
    BylawsComponent,
    RulesComponent,
    NavErrorComponent,
    HospitalityComponent,
    DialogComponent,
    EventCalendarComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FlexLayoutModule,
    ButtonModule,
    MenubarModule
  ],
  providers: [],
  bootstrap: [AppComponent,DialogComponent]
})
export class AppModule { }
