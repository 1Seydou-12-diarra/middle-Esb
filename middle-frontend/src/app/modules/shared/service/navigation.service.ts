import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
	providedIn: 'root'
})
export class NavigationService {

	
	constructor(private router: Router) {
	}

	public async goTo(route: string): Promise<void> {
		await this.router.navigate([route]);
	}

	
	isConnexion(): boolean {
		return this.router.url === 'connexion'; 
	}

	url(): String {
		return this.router.url; 
	}


	isCarteInteractive(): boolean {
		return this.router.url === '/carte-interactive';
	}

	isResultat(): boolean {
		return this.router.url.includes('/resultat/');
	}

	goToDashbord(): void {
		this.goTo('tableau-de-bord');
	}

	goToConnexion(): void {
		this.goTo('connexion');
	}

	isResultatsDetailles(): boolean {
		return this.router.url.includes('/resultat/bureau-vote');
	} 
}
