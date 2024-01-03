import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {Credentials} from '../../shared/model/credentials';
import {AuthService} from '../../shared/service/auth.service';
import {NavigationService} from '../../shared/service/navigation.service';
import {Utilisateur} from "../../shared/model/Utilisateur";
import {UtilisateurService} from "../../shared/service/utilisateur.service";
import {Message} from "primeng/api";
import {finalize} from "rxjs";

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.scss']
})
export class ConnexionComponent {


  loginForm: FormGroup;
	messageActif = false;
	messageErreur: Message[] = [];
	isLoading = false;
  ouvrirModaleChangerMotPasse: boolean;
  utilisateur: Utilisateur;

	constructor(private formBuilder: FormBuilder,
				private route: Router,
				private navigationService: NavigationService,
				private authService: AuthService,
              private utilisateurService: UtilisateurService) {
  }

	ngOnInit(): void {
		if (this.authService.isAuthenticated()) {
			this.navigationService.goToDashbord();
		}
		this.loginForm = this.formBuilder.group({
			login: ['', [Validators.required, Validators.maxLength(255)]],
			motPasse: ['', [Validators.required, Validators.maxLength(255)]]
		});
	}

	/**
	 * Authentifie l'utilisateur.
	 */
	connexion(): void {
		if (this.loginForm.invalid) {
      this.messageErreur = [{ detail: 'Renseignez tous les champs', severity: 'error'}];

      this.messageActif = true;
		} else {
      const utilisateur: Credentials = new Credentials(
        this.loginForm.get('login').value,
        this.loginForm.get('motPasse')?.value
      );
      this.isLoading = true;
      this.messageActif = false;
      this.messageErreur = [];
      this.authService.authentifier(utilisateur)
        .pipe(
          finalize(
            () => this.isLoading = false
          )
        ).subscribe(
        (value: any) => {
          localStorage.clear();
          const jwtToken = value.token;
          this.authService.enregistrerToken(jwtToken);
          this.utilisateur = this.authService.getUtilisateurConnecte();
          console.log(this.utilisateur)
          if (this.utilisateur?.dejaConnecte) {
            this.navigationService.goToDashbord();
          } else {
            this.ouvrirModaleChangerMotPasse = true;
          }
        },
        (err) => {
          if (err.status === 403) {
            this.messageErreur = [{detail: 'Nom d\'utilisateur ou mot de passe incorrect', severity: 'error'}];
          } else if (!err.error?.message) {
            this.messageErreur = [{detail: 'Serveur non disponible', severity: 'error'}];
          } else {
            this.messageErreur = [{detail: err.error?.message, severity: 'error'}];
          }
          this.messageActif = true;
          this.isLoading = false;
        }
      );
		}
	}

  motDePasseChange(change: any) {
    if (change) {
      const login = this.utilisateur?.username ? this.utilisateur?.username : this.loginForm.get('login').value;
      this.utilisateurService.modifierEtatConnexion(login)
        .pipe(
          finalize(
            () => this.isLoading = false
          )
        ).subscribe(
        (value) => {
          localStorage.clear();
          const jwtToken = value?.token;
          this.authService.enregistrerToken(jwtToken);
          this.utilisateur = this.authService.getUtilisateurConnecte();
          if (this.utilisateur?.dejaConnecte) {
            this.navigationService.goToDashbord();
          } else {
            this.ouvrirModaleChangerMotPasse = true;
          }
        },
        () => {
          this.isLoading = false;
        }
    )
    }
    else {
      this.isLoading = false;
    }
  }
}
