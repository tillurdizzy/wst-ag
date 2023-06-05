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
import { CommitteesComponent } from './committees/committees.component';
import { LandscapeComponent } from './committees/landscape/landscape.component';
import { EventsComponent } from './committees/events/events.component';
import { BylawsComponent } from './committees/bylaws/bylaws.component';
import { RulesComponent } from './committees/rules/rules.component';
import { NavErrorComponent } from './library/nav-error/nav-error.component';
import { HospitalityComponent } from './committees/hospitality/hospitality.component';
import { DialogComponent } from './library/dialog/dialog.component';
import { PanelTopComponent } from './home/panel-top/panel-top.component';
import { PanelBottomComponent } from './home/panel-bottom/panel-bottom.component';
import { PanelMiddleComponent } from './home/panel-middle/panel-middle.component';
import { PanelSideComponent } from './home/panel-side/panel-side.component';
import { ExpendituresComponent } from './hoa/expenditures/expenditures.component';
import { DocsComponent } from './hoa/docs/docs.component';
import { UsersComponent } from './users/users.component';
import { SigninComponent } from './users/signin/signin.component';
import { ForumComponent } from './forum/forum.component';
import { ForumService } from './services/forum.service';
import { SupabaseService } from './services/supabase.service';
import { UserService } from './services/user.service';

@NgModule({
  declarations: [
    AppComponent,
    TopbarMenuComponent,
    HomeComponent,
    HoaComponent,
    MeetingsComponent,
    MembersComponent,
    IssuesComponent,
    CommitteesComponent,
    LandscapeComponent,
    EventsComponent,
    BylawsComponent,
    RulesComponent,
    NavErrorComponent,
    HospitalityComponent,
    DialogComponent,
    PanelTopComponent,
    PanelBottomComponent,
    PanelMiddleComponent,
    PanelSideComponent,
    ExpendituresComponent,
    DocsComponent,
    UsersComponent,
    SigninComponent,
    ForumComponent,
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
  providers: [ForumService,SupabaseService,UserService],
  bootstrap: [AppComponent,DialogComponent]
})
export class AppModule { }
