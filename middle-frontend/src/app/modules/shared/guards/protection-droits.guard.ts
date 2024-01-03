import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Utilisateur } from '../model/Utilisateur';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProtectionDroits   {

  constructor(
    private authService: AuthService) {
}

utilisateurConnecte: Utilisateur;


  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      this.utilisateurConnecte = this.authService.getUtilisateurConnecte();
      if(this.utilisateurConnecte.profil=="SUPER_ADMIN" || this.utilisateurConnecte.profil=="ADMIN"){
        return true;
      }else{
        return false;
      }
    
  }
  
}
