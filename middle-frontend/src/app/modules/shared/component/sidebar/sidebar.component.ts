import {Component, EventEmitter, HostListener, OnInit, Output} from '@angular/core';
import {animate, style, transition, trigger} from '@angular/animations';
import {NavbarData} from './nav-data';
import {Router} from '@angular/router';
import {INavBarData} from "./helper";
import {NavigationService} from "../../service/navigation.service";
import {Utilisateur} from "../../model/Utilisateur";
import {AuthService} from "../../service/auth.service";
import { MenuItem } from 'primeng/api';

interface SideNavToggle {
	screenwidth: number;
	collapsed: boolean;
}

@Component({
	selector: 'app-sidebar',
	templateUrl: './sidebar.component.html',
	styleUrls: ['./sidebar.component.scss'],
	animations: [
		trigger('fadeInOut', [
			transition(':enter', [
				style({opacity: 0}),
				animate('350ms',
					style({opacity: 1})
				)
			]),
			transition(':leave', [
				style({opacity: 1}),
				animate('350ms',
					style({opacity: 0})
				)
			])
		]),
	]
})
export class SidebarComponent implements OnInit {

	@Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();
	collapsed = true;
	screenwidth = 0;
  navData: INavBarData[] = [];
	multiple = false;
  utilisateur: Utilisateur;
  items: MenuItem[];

  role = '';
	nom: string;
	prenoms: string;
  ouvrirModaleChangerMotPasse: boolean;

	@HostListener('window:resize', ['$event'])
	onResize(event: any) {
		this.screenwidth = window.innerWidth;
		if (this.screenwidth <= 768) {
			this.collapsed = false;
			this.onToggleSideNav.emit({collapsed: this.collapsed, screenwidth: this.screenwidth});
		}
	}

  constructor(private navigationService: NavigationService, private authService: AuthService) {
	}

  ngOnInit(): void {
    this.screenwidth = window.innerWidth;
    this.utilisateur = this.authService.getUtilisateurConnecte();
    const profil = this.authService.getUtilisateurConnecte()?.profil;
    // if (profil === 'ADMIN') {
    //   this.navData = NavbarData.menusPourAdmin();
    // } else if (profil === 'SUPER_ADMIN') {
    //   this.navData = NavbarData.menusPourSuperAdmin();
    // } else if (profil === 'UTILISATEUR') {
    //   this.navData = NavbarData.menusPourUtilisateurs();
	// }
	  this.navData = NavbarData.menusPourAdmin();
	  
	this.items = [
		{label: 'DECONNECTION', icon: 'pi pi-power-off', command: () => {

		}},
		{label: 'Changer password', icon: 'pi pi-lock', command: () => {

		}}
	];
  }

	toggleCollapse(): void {
		this.collapsed = !this.collapsed;
		this.onToggleSideNav.emit({collapsed: this.collapsed, screenwidth: this.screenwidth});
	}
	closeSidenav(): void {
		this.collapsed = false;
	    this.onToggleSideNav.emit({collapsed: this.collapsed, screenwidth: this.screenwidth});
	  }

	toggleAdminItems(): void {
		if (!this.collapsed) {
			this.collapsed = true;
			this.onToggleSideNav.emit({collapsed: this.collapsed, screenwidth: this.screenwidth});
		}
	}

	handleClick(item: INavBarData): void {
		if (!this.multiple) {
			for (const modelItem of this.navData) {
				if (item !== modelItem && modelItem.expanded) {
					modelItem.expanded = false;
				}
			}
		}
		item.expanded = !item.expanded;
	}

	/**
	 * Méthode de déconnection
	 * @constructor
	 */
	deconnecter(): void {
		localStorage.clear();
		this.navigationService.goToConnexion();
	}

	/**
	 * Retourne true si on est sur l'un des onglets du menu résultat.
	 */
	isResultat(): boolean {
		return this.navigationService.isResultat();
	}

  /**
   * Ouverture de la modale de changement de mot de passe
   */
  ouvrirModaleChangerDeMotPasse() {
    this.ouvrirModaleChangerMotPasse = true;
  }
}
