import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-dashboard-welcome',
  templateUrl: './dashboard-welcome.component.html',
  styleUrls: ['./dashboard-welcome.component.scss']
})
export class DashboardWelcomeComponent implements OnInit {
  ngOnInit(): void {
    this.items = [
  ];
  
  this.home = {icon: 'pi pi-home'};

  }

  items: MenuItem[];
  home: MenuItem;
  

  
}
