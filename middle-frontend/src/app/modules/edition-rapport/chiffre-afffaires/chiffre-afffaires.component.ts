import {DatePipe} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {Calendar} from 'primeng/calendar';
import {ChiffreAffaire} from '../../shared/model/ChiffreAffaire';
import {EditionRapportService} from '../../shared/service/edition-rapport.service';
import {urls} from "../../shared/model/urls";
import {uniq} from 'lodash';
import {BrowserService} from "../../shared/service/browser.service";
import {MenuItem, Message} from "primeng/api";
import {finalize} from "rxjs";
import { DateUtils } from '../../shared/Utils/dateUtils';

@Component({
  selector: 'app-chiffre-afffaires',
  templateUrl: './chiffre-afffaires.component.html',
  styleUrls: ['./chiffre-afffaires.component.scss']
})
export class ChiffreAfffairesComponent implements OnInit {


  cols!: any[];
  exportColumns!: any[];
  periodesSelectionnees: Date[];
  periode: Calendar;
  displayModal: boolean;
  isLoading = false;
  dialogDetailMTN = false;
  dialogDetailMOOV = false;
  tauxMoov: string;
  dialogDetailORANGE = false;
  tauxSharingOperateur = 0;
  tauxSharingEburtis = 0;
  dateSelectionnee: string;
  operateurSelectionne: string;
  chiffreAffaires: ChiffreAffaire[];
  chiffreAffaireSel = [];
  listeOperateur: string[] = [];
  messageActif: boolean;
  messageErreur: Message[] = [];
  items: MenuItem[];
  home: MenuItem;

  constructor(private editionRapport: EditionRapportService,
              public datePipe: DatePipe,
              private browserService: BrowserService) {

  }

  ngOnInit(): void {
    const aujourdhui = new Date();
    const premierJour = new Date(aujourdhui.getFullYear(), aujourdhui.getMonth(), 1);


    this.messageErreur = [];
    this.messageActif = false;
    this.periodesSelectionnees = [premierJour, aujourdhui];
    this.recupererChiffreAffaire();

    this.items = [
      {label: 'Edition rapport'},
      {label: 'Chiffre d\'affaires généré'},
    ];
    this.home = {icon: 'pi pi-home'};

  }

  showModalDialog() {
    this.displayModal = true;
  }


  closeVoirPlus() {
    this.dialogDetailMOOV = false;
    this.dialogDetailMTN = false;
    this.dialogDetailORANGE = false;
  }

  initialisationVoirplus(chiffreAffaireSelected: ChiffreAffaire) {
    this.chiffreAffaireSel = [];
    this.tauxSharingEburtis = 0;
    this.dateSelectionnee = chiffreAffaireSelected.dateConsultation;
    this.operateurSelectionne = chiffreAffaireSelected.operateur;
    this.tauxSharingOperateur = chiffreAffaireSelected.pourcentageSharing;
    this.tauxSharingEburtis = 100 - this.tauxSharingOperateur;
    this.chiffreAffaireSel.push(chiffreAffaireSelected)
    if (chiffreAffaireSelected.operateur == "MTN") {
      this.dialogDetailMTN = true;
    } else if (chiffreAffaireSelected.operateur == "MOOV") {
      this.dialogDetailMOOV = true;
      this.tauxMoov = chiffreAffaireSelected.moovCharges.tauxCharge.toString().substr(0, 5);
    } else if (chiffreAffaireSelected.operateur == "ORANGE") {
      this.dialogDetailORANGE = true;
    }

  }

  /**
   * Récupère la liste des chiffres d'affaires
   */
  public recupererChiffreAffaire(): void {
    this.isLoading = true;
    this.messageErreur = [];
    this.messageActif = false;
    const [dateDebut, dateFin] = this.periodesSelectionnees;

    this.editionRapport.recupererListeChiffreAffaire(DateUtils.localToUtc(dateDebut),DateUtils.localToUtc(dateFin) )
      .pipe(
        finalize(
          () => this.isLoading = false
        )
      ).subscribe(
      (chiffreAffaires) => {
        this.chiffreAffaires = chiffreAffaires?.sort();
        this.listeOperateur = uniq(this.chiffreAffaires.map(c => c.operateur)).sort();
      },
      (err) => {
        if (err.error?.message) {
          this.messageErreur = [{detail: err.error?.message, severity: 'error'}];
          this.messageActif = true;
        }
      }
    );
  }


  /**
   * Permet de vider toutes les valeurs des filtres
   */
  viderfiltre(): void {

    this.periodesSelectionnees = [];

  }

  /**
   * Cette fonction permet de valider les filtres
   */
  public rechercher(): void {
    this.recupererChiffreAffaire();
  }

  onSelectDate() {
    const [dateMin, dateMax] = this.periodesSelectionnees ? this.periodesSelectionnees : [];
    const dateFin = dateMax ? String(new Date(dateMax)) : null;
    if (dateFin != null) {
      this.periode.hideOverlay();
    }
  }


  /**
   * Exporter les données au format Excel
   */
  public exportExcel(): void {
    import('xlsx').then(xlsx => {
      let Heading = [['Date consultation', 'Opérateur', 'Nombre de consultations', 'Coût unitaire facturé', 'Montant total facturé', 'Montant à encaisser']];
      const wb = xlsx.utils.book_new();
      const ws = xlsx.utils.json_to_sheet([]);
      xlsx.utils.sheet_add_aoa(ws, Heading);
      xlsx.utils.sheet_add_json(ws, this.chiffreAffaires, {origin: 'A2', skipHeader: true});
      xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');
      xlsx.writeFile(wb, 'chiffres-d\'affaires.xlsx');
    });
    this.displayModal = false
  }

  /**
   * Exporter les données au format Csv
   */
  public exportCSV(): void {
    import('xlsx').then(xlsx => {
      let HeadingCSV = [['Date consultation', 'Opérateur', 'Nombre de consultations', 'Coût unitaire facturé', 'Montant total facturé', 'Montant à encaisser']];
      const wb = xlsx.utils.book_new();
      const ws = xlsx.utils.json_to_sheet([]);
      xlsx.utils.sheet_add_aoa(ws, HeadingCSV);
      xlsx.utils.sheet_add_json(ws, this.chiffreAffaires, {origin: 'A2', skipHeader: true});
      xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');
      xlsx.writeFile(wb, 'chiffres-d\'affaires.csv');
    });
    this.displayModal = false
  }

  /**
   * imprimer la liste des chiifres d'affaires
   */
  public impremerChiffreAffaire(): void {
    this.isLoading = true;
    const [dateDebut, dateFin] = this.periodesSelectionnees;
    this.messageErreur = [];
    this.messageActif = false;
    this.browserService.ouvrirPdf(`${urls.imprimerChiffreAffaire}/${DateUtils.localToUtc(dateDebut).getTime()}/${DateUtils.localToUtc(dateFin).getTime()}`, () => this.isLoading = false, err => {
      this.messageErreur = [{detail: err.error?.message, severity: 'error'}];
      this.messageActif = true;
    });
  }

  /**
   * imprimer la liste des chiifres d'affaires
   */
  public impremerDetailsChiffreAffaire(operateur: string): void {
    this.isLoading = true;
    const [dateDebut, dateFin] = this.periodesSelectionnees;
    this.messageErreur = [];
    this.messageActif = false;
    this.browserService.ouvrirPdf(`${urls.imprimerDetailsChiffreAffaire}/${DateUtils.localToUtc(dateDebut).getTime()}/${DateUtils.localToUtc(dateFin).getTime()}/${operateur}`, () => this.isLoading = false, err => {
      this.messageErreur = [{detail: err.error?.message, severity: 'error'}];
      this.messageActif = true;
    });
  }

  peutRechercher(): boolean {
    return this.periodesSelectionnees && this.periodesSelectionnees.length === 2 && this.periodesSelectionnees[0] != null && this.periodesSelectionnees[1] != null;
  }
}
