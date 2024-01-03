import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Utilisateur} from '../../shared/model/Utilisateur';
import {TableauUtilisateur} from '../../shared/model/TableauUtilisateur';
import {UtilisateurService} from '../../shared/service/utilisateur.service';
import {MenuItem, Message, SelectItem} from "primeng/api";
import {AuthService} from "../../shared/service/auth.service";
import {uniq} from 'lodash';
import {CustomValidators} from "../../shared/validator/custom-validator";
import {finalize} from "rxjs";

@Component({
  selector: 'app-utilisateur',
  templateUrl: './utilisateur.component.html',
  styleUrls: ['./utilisateur.component.scss']
})
export class UtilisateurComponent implements OnInit {

  utilisateurTableau: TableauUtilisateur;
  isLoading = false;
  utilisateurSelectonne: Utilisateur;
  ouvrirModaleSaisieUtilisateur!: boolean;
  submitted!: boolean;
  utilisateurForm: FormGroup;
  // utilisateur:Utilisateur= new Utilisateur();
  messageActif = false;
  messageErreur: Message[] = [];
  roles: string[] = [];

  rolesSelect: SelectItem[];
  statutSelect: SelectItem[];
  statuts: string[] = [];
  utilisateurConnecte: Utilisateur;
  items: MenuItem[];
  home: MenuItem;
  readonlyEmailLogin = true;

  constructor(private utilisateurService: UtilisateurService,
              private formBuilder: FormBuilder,
              private authService: AuthService) {

  }


  ngOnInit(): void {

    this.rolesSelect = [
      {
        label: 'Administrateur',
        value: 'ADMIN'
      },
      {
        label: 'Super administrateur',
        value: 'SUPER_ADMIN'
      },
      {
        label: 'Utilisateur',
        value: 'UTILISATEUR'
      }
    ];

    this.statutSelect = [
      {
        label: 'Actif',
        value: 'ACTIF'
      },
      {
        label: 'Inactif',
        value: 'INACTIF'
      }
    ];
    this.items = [
      {label: 'Utilisateurs'},
    ];
    this.home = {icon: 'pi pi-home'};

    this.utilisateurForm = this.formBuilder.group({
      nom: [null , [Validators.required, Validators.maxLength(255), CustomValidators.notBlank]],
      prenoms: [null, [Validators.required, Validators.maxLength(255), CustomValidators.notBlank]],
      profil: [this.rolesSelect[2].value, [Validators.required]],
      email: [null, [Validators.required, Validators.email, Validators.maxLength(255), CustomValidators.notBlank]],
      statut: [this.statutSelect[0].value, [Validators.required]],
      username: [null, [Validators.required, CustomValidators.notBlank]]
    });

    this.messageErreur = [];
    this.messageActif = false;

    this.utilisateurConnecte = this.authService.getUtilisateurConnecte();
    this.recupererDonneesUtilisateurs();

    // Construction en dur des roles

  }

  recupererDonneesUtilisateurs(): void {
    this.isLoading = true;
    this.utilisateurService.recupererListeUtilisateurs()
      .pipe(
        finalize(
          () => this.isLoading = false
        )
      ).subscribe(
      (data) => {
        this.utilisateurTableau = data;
        this.roles = uniq(data.utilisateurs?.map(u => u.profil)).sort();
        this.statuts = uniq(data.utilisateurs?.map(u => u.statut)).sort();
      },
      (error) => {
        if (error.error?.message) {
          this.messageErreur = error.error?.message;
          this.messageActif = true;
        }
      }
    );
  }

  public openUtilisateurdialog() {
    this.ouvrirModaleSaisieUtilisateur = true;
    this.readonlyEmailLogin=false;
    this.messageActif = false;
  }

  public onSaveUtilisateur() {
    if (this.utilisateurForm.invalid) {
      this.messageErreur = [{detail: 'Veuillez saisir correctement tous les champs', severity: 'error'}];
      this.messageActif = true;
    } else {
      this.messageActif = false;
      this.isLoading = true;
      this.utilisateurService.enregistrerUtilisateur(this.utilisateurForm.value)
        .pipe(
          finalize(
            () => this.isLoading = false
          )
        ).subscribe(
        (value) => {
          this.fermerModale();
          this.recupererDonneesUtilisateurs();
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

  fermerModale() {
    this.utilisateurForm.reset();
    this.messageActif = false;
    this.ouvrirModaleSaisieUtilisateur = false;
    this.isLoading = false;
  }
  readonly(){
    return true
  }

  modifier(utilisateur: Utilisateur) {
    this.utilisateurForm.setValue({
      nom: utilisateur.nom,
      prenoms: utilisateur.prenoms,
      profil: this.rolesSelect.find(r => r.label === utilisateur.profil).value,
      email: utilisateur.email,
      statut: this.statutSelect.find(s => s.label === utilisateur.statut).value,
      username: utilisateur.username

    });
    this.readonlyEmailLogin=true;
    this.ouvrirModaleSaisieUtilisateur = true;
  }
}
