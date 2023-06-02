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
    this.items = [
        {
            label: 'Home',
            routerLink:"home",
            icon: 'pi pi-fw pi-calendar',
        },
        {
            label: 'HOA',
            routerLink:"hoa",
            icon: 'pi pi-fw pi-file',
            items: [
                {
                    label: 'Meeting Minutes',
                    icon: 'pi pi-fw pi-plus',
                    routerLink:'hoa/hoa-meetings',
                },
                {
                    label: 'Board Members',
                    icon: 'pi pi-fw pi-trash',
                    routerLink:'hoa/hoa-members',
                },
                {
                    label: 'Current Issues',
                    icon: 'pi pi-fw pi-external-link',
                    routerLink:"hoa/hoa-issues",
                }
            ]
        },
        {
            label: 'Committees',
            icon: 'pi pi-fw pi-pencil',
            items: [
                {
                    label: 'Landscape',
                    icon: 'pi pi-fw pi-align-left',
                    routerLink:'/committees/committees-landscape'
                },
                {
                    label: 'Hospitality',
                    icon: 'pi pi-fw pi-align-right',
                    routerLink:'/committees/committees-hospitality'
                },
                {
                    label: 'Events',
                    icon: 'pi pi-fw pi-align-center',
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
            label: 'Events',
            icon: 'pi pi-fw pi-calendar',
            routerLink:'/calendar'
        },
        {
            label: 'Forum',
            icon: 'pi pi-fw pi-calendar',
        },
        {
            label: 'Sign In',
            icon: 'pi pi-fw pi-power-off',
            routerLink:'/signin'
        },
       
    ];
}
}
