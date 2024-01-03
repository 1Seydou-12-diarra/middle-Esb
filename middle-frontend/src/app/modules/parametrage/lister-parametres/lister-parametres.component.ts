import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, RequiredValidator, Validators } from "@angular/forms";
import { Parametrage } from "../../shared/model/parametrage.model";
import { ParametrageService } from "../../shared/service/parametrage.service";
import { FormRow } from "../../shared/model/form-row.model";
import { MenuItem, Message, SelectItem } from "primeng/api";
import { finalize, forkJoin } from "rxjs";
import { AuthService } from "../../shared/service/auth.service";
import { Utilisateur } from "../../shared/model/Utilisateur";
import { RequiredValidators } from '../../shared/validator/required-validator';

@Component({
  selector: 'app-lister-parametres',
  templateUrl: './lister-parametres.component.html',
  styleUrls: ['./lister-parametres.component.scss']
})
export class ListerParametresComponent implements OnInit {
  REGEX_DUREE = '(1[0-9]|2[0-3]|0[0-9]):([0-5][0-9])$|^(__:){1}(__)$';
  REGEX_SAISI_ENTIER = '^[0-9][0-9]*$';
  isLoading: boolean;
  formParametrage: FormGroup;
  parametrageClone: Map<Parametrage, Parametrage> = new Map<Parametrage, Parametrage>();
  formulaireParParametrage: Map<Parametrage, FormRow>;

  parametrages: Parametrage[];
  imprimantes: SelectItem<any>[];

  typeEnvoi: SelectItem[];
  estParametragefrequenceEnvoi: boolean;

  utilisateurConnecte: Utilisateur;

  messageActif: boolean;
  messageErreur: Message[] = [];
  // actif: boolean;
  items: MenuItem[];
  home: MenuItem;

  constructor(private parametrageService: ParametrageService,
    private formBuilder: FormBuilder,
    private authService: AuthService) {
  }

  date = new Date();

  dateSelected: Date;

  periodesSelectionnees: Date;

  disabledDates = [new Date(this.date.getUTCMonth() + 1 + "/" + 29 + "/" + this.date.getUTCFullYear()),
  new Date(this.date.getUTCMonth() + 1 + "/" + 30 + "/" + this.date.getUTCFullYear()),
  new Date(this.date.getUTCMonth() + 1 + "/" + 31 + "/" + this.date.getUTCFullYear())
  ]

  ngOnInit(): void {
    this.typeEnvoi = [
      {
        label: 'Journalier',
        value: 'JOURNALIER'
      },
      {
        label: 'Hebdo',
        value: 'HEBDO'
      },
      {
        label: 'Mensuel',
        value: 'MENSUEL'
      }
    ]
  
    this.items = [
      { label: 'Paramétrage' },
      { label: 'Paramètres généraux' },
    ];
    this.home = { icon: 'pi pi-home' };

    this.formParametrage = this.formBuilder.group({
      parametrages: this.formBuilder.array([])
    });

    this.messageErreur = [];
    this.messageActif = false;
    this.formulaireParParametrage = new Map<Parametrage, FormRow>();
    this.utilisateurConnecte = this.authService.getUtilisateurConnecte();
    this.lister();
  }

  get estFrequenceEnvoi() {
    return this.estParametragefrequenceEnvoi;
  }

  lister(): void {
    this.isLoading = true;
    this.formParametrage.reset();
    this.formulaireParParametrage = new Map<Parametrage, FormRow>();
    this.messageErreur = [];
    this.messageActif = false;
    forkJoin([this.parametrageService.lister(), this.parametrageService.listerImprimante()])
      .pipe(
        finalize(
          () => this.isLoading = false
        )
      ).subscribe(
        ([parametrages, imprimantes]) => {
          this.parametrages = parametrages;
          imprimantes?.push('');
          this.imprimantes = imprimantes.sort((e1, e2) => e1.localeCompare(e2)).map(imprimante => {
            return {
              label: imprimante === '' ? 'Aucun' : imprimante,
              value: imprimante
            };
          });

          if (this.parametrages && this.parametrages.length) {
            this.parametrages.forEach(parametrage => this.ajouterParametrageDansFormArray(parametrage));
          }
        },
        (error) => {
          if (error.error?.message) {
            this.messageErreur = [{ detail: error.error?.message, severity: 'error' }];
            this.messageActif = true
          }
        }
      )
  }

  initialiserModification(parametrage: Parametrage) {
    const formRow = this.formulaireParParametrage.get(parametrage);
    if (formRow) {
      formRow.ecriture = true;
      this.parametrageClone.set(parametrage, new Parametrage().deserialize(parametrage));
      this.estParametragefrequenceEnvoi = parametrage?.code === 'FREQUENCE_ENVOI';
      formRow.formGroup.setValue({
        code: parametrage?.code,
        valeur: parametrage.code === 'FREQUENCE_ENVOI' ? new Date() : parametrage?.valeur,
        designation: parametrage?.designation,
        actif: parametrage?.actif,
        heure: parametrage?.heure,
      })
    }
  }

  enregistrer(parametrage: Parametrage) {
    console.log(this.formParametrage)

    this.isLoading = true;
    this.messageErreur = [];
    this.messageActif = false;
    const formRow = this.formulaireParParametrage.get(parametrage);
    console.log(formRow.formGroup.getRawValue())

    if (formRow.formGroup.invalid) {
      this.messageErreur = [{ detail: 'Veillez saisir une heure correcte !', severity: 'error' }];
      this.messageActif = true;
      this.isLoading = false;
    } else {

      this.parametrageService.modifier(formRow.formGroup.getRawValue())
        .pipe(
          finalize(
            () => this.isLoading = false
          )
        ).subscribe(
          (parametrageRetournee) => {
            formRow.reset();
            this.parametrageClone.delete(parametrage);
            Object.assign(parametrage, new Parametrage().deserialize(parametrageRetournee));
          },
          (error) => {
            if (error.error?.message) {
              this.messageErreur = [{ detail: error.error?.message, severity: 'error' }];
              this.messageActif = true;
            }
          }
        )
    }

  }

  annulerModification(parametrage: Parametrage) {
    const formRow = this.formulaireParParametrage.get(parametrage);
    formRow.ecriture = false;
    Object.assign(parametrage, this.parametrageClone.get(parametrage));
    this.parametrageClone.delete(parametrage);
  }

  ajouterParametrageDansFormArray(parametrage: Parametrage) {
    const formGroup = this.formBuilder.group({
      code: [parametrage.code],
      designation: [parametrage.designation, [Validators.required, Validators.maxLength(255)]],
      valeur: [parametrage.valeur ? parametrage.valeur : " ", [Validators.required, Validators.maxLength(255)]],
      actif: [parametrage.actif],
      heure: [null, [RequiredValidators.requiredIf(() => this.estFrequenceEnvoi), Validators.pattern(this.REGEX_DUREE)]]
    });

    formGroup.controls.designation.valueChanges.subscribe(nouvelleValeur => parametrage.designation = nouvelleValeur);
    formGroup.controls.valeur.valueChanges.subscribe(nouvelleValeur => parametrage.valeur = nouvelleValeur);
    formGroup.controls.actif.valueChanges.subscribe(nouvelleValeur => parametrage.actif = nouvelleValeur);

    const formArray = this.formParametrage.get('parametrages') as FormArray;
    formArray.push(formGroup);

    this.formulaireParParametrage.set(parametrage, new FormRow(formGroup));
  }
}
