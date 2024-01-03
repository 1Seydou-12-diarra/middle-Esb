import { Component } from '@angular/core';

import { MenuItem, Message, MessageService, SelectItem } from 'primeng/api';
import { ApplicationService } from '../../shared/service/application.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TableauUtilisateur } from 'src/app/modules/shared/model/TableauUtilisateur';
import { Utilisateur } from 'src/app/modules/shared/model/Utilisateur';
import { UtilisateurService } from 'src/app/modules/shared/service/utilisateur.service';
import { AuthService } from 'src/app/modules/shared/service/auth.service';
import { CustomValidators } from 'src/app/modules/shared/validator/custom-validator';
import { finalize } from 'rxjs';
import { Application } from 'src/app/modules/shared/model/Application';
import { TableauApplication } from '../../shared/model/TableauApplication';
import { uniq } from 'lodash';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss']
})
export class ApplicationComponent {

  tableauApplication: TableauApplication;
  isLoading = false;
  applicationselectionne: Application;
  ouvrirModaleSaisieApplication!: boolean;
  submitted!: boolean;
  applicationFormgroup: FormGroup;
  // utilisateur:Utilisateur= new Utilisateur();
  messageActif = false;
  messageErreur: Message[] = [];
  statutSelect: SelectItem[];
  statuts: string[] = [];
  utilisateurConnecte: Utilisateur;
  items: MenuItem[];
  home: MenuItem;
  readonlyNom = true;

  constructor(private applicationService: ApplicationService,
    private formBuilder: FormBuilder,
    private authService: AuthService) {
    this.applicationFormgroup = this.formBuilder.group({
      nom: [null, [Validators.required, Validators.maxLength(255), CustomValidators.notBlank]],
      statut: [null, [Validators.required, Validators.maxLength(255), CustomValidators.notBlank]]
    });

  }
  ngOnInit(): void {
    this.recupererDonneesApplications();
    this.statutSelect = [
      {
        label: 'Active',
        value: 'ACTIVE'
      },
      {
        label: 'Inactive',
        value: 'INACTIVE'
      }
    ];
  }

  modifier(application: Application) {
    this.applicationFormgroup.setValue({
      nom: application.nom,
      token: application.token,
      statut: this.statutSelect.find(s => s.label === application.statut).value,
      loginEsb: application.loginEsb,
      tokenEsb: application.tokenEsb,
      authToken: application.authToken,
      authLoginPassword: application.authLoginPassword,
      loginUtilisateur: application.loginUtilisateur

    });
    this.readonlyNom = true;
    this.ouvrirModaleSaisieApplication = true;
  }

  fermerModale() {
    this.applicationFormgroup.reset();
    this.messageActif = false;
    this.ouvrirModaleSaisieApplication = false;
    this.isLoading = false;
  }

  readonly() {
    return true
  }


  recupererDonneesApplications(): void {
    this.isLoading = true;
    this.applicationService.listeApplication()
      .pipe(
        finalize(
          () => this.isLoading = false
        )
      ).subscribe(
        (data) => {
          this.tableauApplication = data;
          this.statuts = uniq(data.applications?.map(u => u.statut)).sort();
        },
        (error) => {
          if (error.error?.message) {
            this.messageErreur = error.error?.message;
            this.messageActif = true;
          }
        }
      );
  }

  public openApplicationDialog() {
    this.ouvrirModaleSaisieApplication = true;
    this.readonlyNom = false;
    this.messageActif = false;
  }

  public onAjouterOuModifier() {
    if (this.applicationFormgroup.invalid) {
      this.messageErreur = [{ detail: 'Veuillez saisir correctement tous les champs', severity: 'error' }];
      this.messageActif = true;
    } else {
      this.messageActif = false;
      this.isLoading = true;
      this.applicationService.ajouterOuModifierApplication(this.applicationFormgroup.value)
        .pipe(
          finalize(
            () => this.isLoading = false
          )
        ).subscribe(
          (value) => {
            this.fermerModale();
            this.recupererDonneesApplications();
          },
          (error) => {
            if (error.error?.message) {
              this.messageErreur = error.error?.message;
              this.messageActif = true;
            }
          },
        );
    }
  }


  // / modifier(utilisateur: Utilisateur) {
  //   //   this.utilisateurForm.setValue({
  //   //     nom: utilisateur.nom,
  //   //     prenoms: utilisateur.prenoms,
  //   //     profil: this.rolesSelect.find(r => r.label === utilisateur.profil).value,
  //   //     email: utilisateur.email,
  //   //     statut: this.statutSelect.find(s => s.label === utilisateur.statut).value,
  //   //     username: utilisateur.username
  //   //   });
  //   //   this.readonlyEmailLogin=true;
  //   //   this.ouvrirModaleSaisieUtilisateur = true;
  // }

  //
  // ngOnInit(): void {
  //
  //   this.rolesSelect = [
  //     {
  //       label: 'Administrateur',
  //       value: 'ADMIN'
  //     },
  //     {
  //       label: 'Super administrateur',
  //       value: 'SUPER_ADMIN'
  //     },
  //     {
  //       label: 'Utilisateur',
  //       value: 'UTILISATEUR'
  //     }
  //   ];
  //
  //   this.statutSelect = [
  //     {
  //       label: 'Actif',
  //       value: 'ACTIF'
  //     },
  //     {
  //       label: 'Inactif',
  //       value: 'INACTIF'
  //     }
  //   ];
  //   this.items = [
  //     {label: 'Utilisateurs'},
  //   ];
  //   this.home = {icon: 'pi pi-home'};
  //
  //
  //
  //   this.messageErreur = [];
  //   this.messageActif = false;
  //
  //   this.utilisateurConnecte = this.authService.getUtilisateurConnecte();
  //   this.recupererDonneesUtilisateurs();
  //
  //   // Construction en dur des roles
  //
  // }
  //
  // recupererDonneesUtilisateurs(): void {
  //   this.isLoading = true;
  //   this.applicationService.listeApplication()
  //           .pipe(
  //                   finalize(
  //                           () => this.isLoading = false
  //                   )
  //           ).subscribe(
  //           (data) => {
  //             this.applicationtableau=data;
  //
  //             // this.utilisateurTableau = data;
  //             // this.roles = uniq(data.utilisateurs?.map(u => u.profil)).sort();
  //             // this.statuts = uniq(data.utilisateurs?.map(u => u.statut)).sort();
  //           },
  //           (error) => {
  //             if (error.error?.message) {
  //               this.messageErreur = error.error?.message;
  //               this.messageActif = true;
  //             }
  //           }
  //   );
  // }
  //
  // public openUtilisateurdialog() {
  //   this.ouvrirModaleSaisieUtilisateur = true;
  //   this.readonlyEmailLogin=false;
  //   this.messageActif = false;
  // }
  //
  // public onSaveUtilisateur() {
  //   if (this.utilisateurForm.invalid) {
  //     this.messageErreur = [{detail: 'Veuillez saisir correctement tous les champs', severity: 'error'}];
  //     this.messageActif = true;
  //   } else {
  //     this.messageActif = false;
  //     this.isLoading = true;
  //     this.applicationService.ajouterOuModifiderApplication(this.utilisateurForm.value)
  //             .pipe(
  //                     finalize(
  //                             () => this.isLoading = false
  //                     )
  //             ).subscribe(
  //             (value) => {
  //               this.fermerModale();
  //               this.recupererDonneesUtilisateurs();
  //             },
  //             (error) => {
  //               if (error.error?.message) {
  //                 this.messageErreur = error.error?.message;
  //                 this.messageActif = true;
  //               }
  //             },
  //     );
  //   }
  // }
  //

  //

}
