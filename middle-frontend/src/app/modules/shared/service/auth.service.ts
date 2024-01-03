import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Token } from '../model/token';
import { urls } from '../model/urls';
import {JwtHelperService} from '@auth0/angular-jwt';
import {Utilisateur} from "../model/Utilisateur";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

	private jwtToken!: string;

  constructor(private httpClient:HttpClient,private jwtHelper: JwtHelperService) { }

  /**
	 * Cette méthode permet à un utilisateur de s'authentifier
	 * @param utilisateur
	 */
  authentifier(utilisateur: any): Observable<Token> {
		return this.httpClient.post<Token>(urls.auth, utilisateur);
	}

	/**
	 * Cette méthode permet d'enregistrer le token dans le localStorage après l'authentification
	 * @param jwtToken
	 */
	enregistrerToken(jwtToken: string): void {
		this.jwtToken = jwtToken;
		localStorage.setItem('token', jwtToken);
	}

	/**
	 * Cette méthode permet de recuperer le token dans le localStorage après l'authentification
	 * @return any
	 */
	recupererToken(): string {
		const token = localStorage.getItem('token');
		return token ? token : '';
	}

	isAuthenticated(): boolean {
		const token = this.recupererToken();
		if (token) {
      const token2 = this.jwtHelper.decodeToken(this.recupererToken());

      return !this.jwtHelper.isTokenExpired(token) && token2.dejaConnecte;
		}
		return false;
	}

  getUtilisateurConnecte(): Utilisateur {
    if (this.isAuthenticated()) {
      const token = this.jwtHelper.decodeToken(this.recupererToken());
      const utilisateur = new Utilisateur();
      utilisateur.nom = token.nom;
      utilisateur.prenoms = token.prenoms;
      utilisateur.username = token.username;
      utilisateur.profil = token.role;
      utilisateur.dejaConnecte = token.dejaConnecte;

      return utilisateur;
    }
    return null;
  }
}
