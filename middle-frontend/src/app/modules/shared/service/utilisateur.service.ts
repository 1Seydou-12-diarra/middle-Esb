import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { urls } from '../model/urls';
import { Utilisateur } from '../model/Utilisateur';
import {UtilisateurConnexion} from "../model/utilisateur-connexion.model";
import {Token} from "../model/token";
import {TableauUtilisateur} from "../model/TableauUtilisateur";

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {

  constructor(private httpClient:HttpClient) { }

  /**
  * Récuperer tout le paquet d'utilisateurs
  * @return Utilisateurs[]
  */
 recupererListeUtilisateurs(): Observable<TableauUtilisateur> {
   return this.httpClient.get<TableauUtilisateur>(urls.listeUtilisateurs);
 }

  /**
  * Ajouter utilisateur
  * @return Utilisateur
  */
  enregistrerUtilisateur(utilisateur:any): Observable<any> {
    return this.httpClient.put<Utilisateur>(urls.addUtilisateur, utilisateur);
  }

  modifierPassword(utilisateurConnexon: UtilisateurConnexion): Observable<void> {
    return this.httpClient.put<void>(urls.modifierPassword, utilisateurConnexon);
  }

  modifierEtatConnexion(username: string) : Observable<Token> {
    return this.httpClient.put<Token>(urls.modifierEtatConnexion, username);
  }
}
