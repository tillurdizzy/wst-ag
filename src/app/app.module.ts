import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ToastrModule } from 'ngx-toastr';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { TabViewModule } from 'primeng/tabview';
import { PanelModule } from 'primeng/panel';
import { DividerModule } from 'primeng/divider';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
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
import { ForumMenuComponent } from './forum/forum-menu/forum-menu.component';
import { ForumTopicComponent } from './forum/forum-topic/forum-topic.component';
import { ForumPostComponent } from './forum/forum-post/forum-post.component';
import { AccountComponent } from './users/account/account.component';
import { ResidentsComponent } from './users/residents/residents.component';
import { VehiclesComponent } from './users/vehicles/vehicles.component';
import { ResidentListComponent } from './users/resident-list/resident-list.component';
import { VehicleListComponent } from './users/vehicle-list/vehicle-list.component';
import { PasswordResetComponent } from './users/password-reset/password-reset.component';

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
    ForumMenuComponent,
    ForumTopicComponent,
    ForumPostComponent,
    AccountComponent,
    ResidentsComponent,
    VehiclesComponent,
    ResidentListComponent,
    VehicleListComponent,
    PasswordResetComponent
    
  ],
  imports: [
    BrowserModule,
    CommonModule,
    ToastrModule.forRoot({timeOut:2500,positionClass:'toast-center-center',preventDuplicates:true}),
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
    FlexLayoutModule,
    ButtonModule,
    MenubarModule,
    TabViewModule,
    PanelModule,
    DividerModule,
    TableModule,
    InputTextModule,
    DialogModule,
    PasswordModule,
    DropdownModule
  ],
  providers: [ForumService,SupabaseService,UserService],
  bootstrap: [AppComponent],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
