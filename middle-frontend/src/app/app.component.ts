import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { AuthService } from './modules/shared/service/auth.service';
import { NavigationService } from './modules/shared/service/navigation.service';
import { Router } from '@angular/router';

interface SideNavToggle{
  screenwidth:number;
  collapsed:boolean
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Middle';

  isSideNavCollapsed = true;
	screenwidth = 1920;
	name: string;
	commissionLocales: string[] = [];
	showNotification = false;
	audioContext = new AudioContext();
  splitted!:string[];
  activePage!:any;


  constructor(private authService: AuthService,
    private navigationService: NavigationService,
    private messageService: MessageService,
    private router:Router
    ) {
    }


  ngOnInit(): void { 
    if (!this.authService.isAuthenticated()) {
			this.navigationService.goToDashbord;
		}
  }


    
  
  isConnexion(): boolean {
    this.splitted= window.location.href.split("/");
    return this.splitted[this.splitted.length-1]=="connexion";
  }

onToggleSideNav(data: SideNavToggle):void {
       this.screenwidth=data.screenwidth;
       this.isSideNavCollapsed=data.collapsed;
}

}