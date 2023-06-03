import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { TabViewModule } from 'primeng/tabview';
import { PanelModule } from 'primeng/panel';
import { DividerModule } from 'primeng/divider';
import { TableModule } from 'primeng/table';
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
import { PanelTopComponent } from './home/panel-top/panel-top.component';
import { PanelBottomComponent } from './home/panel-bottom/panel-bottom.component';
import { PanelMiddleComponent } from './home/panel-middle/panel-middle.component';
import { PanelSideComponent } from './home/panel-side/panel-side.component';
import { ExpendituresComponent } from './hoa/expenditures/expenditures.component';

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
    EventCalendarComponent,
    PanelTopComponent,
    PanelBottomComponent,
    PanelMiddleComponent,
    PanelSideComponent,
    ExpendituresComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FlexLayoutModule,
    ButtonModule,
    MenubarModule,
    TabViewModule,
    PanelModule,
    DividerModule,
    TableModule
  ],
  providers: [],
  bootstrap: [AppComponent,DialogComponent]
})
export class AppModule { }
