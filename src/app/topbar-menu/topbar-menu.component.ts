import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-topbar-menu',
  templateUrl: './topbar-menu.component.html',
  styleUrls: ['./topbar-menu.component.scss']
})
export class TopbarMenuComponent implements OnInit {
 
  items:MenuItem[] = [];




  
  ngOnInit() {
    console.log("TopbarMenuComponent >> ngOnInit()")
    this.items = [
        {
            label: 'Home',
            routerLink:"home",
            icon: 'pi pi-fw pi-home',
        },
        {
            label: 'Committees',
            icon: 'pi pi-fw pi-users',
            items: [
                {
                    label: 'Landscape',
                    icon: 'pi pi-fw pi-sun',
                    routerLink:'/committees/committees-landscape'
                },
                {
                    label: 'Hospitality',
                    icon: 'pi pi-fw pi-heart',
                    routerLink:'/committees/committees-hospitality'
                },
                {
                    label: 'Events',
                    icon: 'pi pi-fw pi-calendar',
                    routerLink:'/committees/committees-events'
                },
                {
                    label: 'By-Laws',
                    icon: 'pi pi-fw pi-align-center',
                    routerLink:'/committees/committees-bylaws'
                },
                {
                    label: 'Rules and Regulations',
                    icon: 'pi pi-fw pi-align-center',
                    routerLink:'/committees/committees-rules'
                },
            ]
        },
        {
            label: 'HOA',
            icon: 'pi pi-fw pi-sitemap',
            items: [
                {
                    label: 'Meeting Minutes',
                    icon: 'pi pi-fw pi-file-pdf',
                    routerLink:'hoa/hoa-meetings',
                },
                {
                    label: 'Current Affairs',
                    icon: 'pi pi-fw pi-bars',
                    routerLink:"hoa/hoa-issues",
                },
                {
                    label: 'Major Expenditures',
                    icon: 'pi pi-fw pi-dollar',
                    routerLink:'hoa/hoa-expenditures',
                },
                {
                    label: 'Documents',
                    icon: 'pi pi-fw pi-align-center',
                    routerLink:'hoa/hoa-docs',
                },
                {
                    label: 'Board Members',
                    icon: 'pi pi-fw pi-trash',
                    routerLink:'hoa/hoa-members',
                },
            ]
        },
       
        {
            label: 'Forum',
            icon: 'pi pi-fw pi-book',
            routerLink:'/forum'
        },
        {
            label: 'Members',
            icon: 'pi pi-fw pi-lock-open',
            routerLink:'/members'
        },
       
    ];
}
}
