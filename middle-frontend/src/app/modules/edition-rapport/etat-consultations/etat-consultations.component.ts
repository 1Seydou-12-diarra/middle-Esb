import {DatePipe} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {Consultation} from '../../shared/model/Consultation';
import {EditionRapportService} from '../../shared/service/edition-rapport.service';
import {Calendar} from 'primeng/calendar';
import {StatutSessionEnum} from 'src/app/modules/shared/model/statutSessionEnum';
import {BrowserService} from '../../shared/service/browser.service';
import {uniq} from 'lodash';
import {urls} from '../../shared/model/urls';
import {MenuItem, Message, SelectItem} from 'primeng/api';
import {finalize} from "rxjs";
import { DateUtils } from '../../shared/Utils/dateUtils';


@Component({
  selector: 'app-etat-consultations',
  templateUrl: './etat-consultations.component.html',
  styleUrls: ['./etat-consultations.component.scss'],
})
export class EtatConsultationsComponent implements OnInit {

  readonly EN_COURS = StatutSessionEnum.EN_COURS;
  readonly TERMINEE = StatutSessionEnum.TERMINEE;
  readonly TIMEOUT = StatutSessionEnum.TIMEOUT;

  consultations: Consultation [] = [];

  cols!: any[];
  exportColumns!: any[];
  periodesSelectionnees: Date[];
  periode: Calendar;
  displayModal: boolean;
  isLoading = false;
  statut: SelectItem[];
  anneeSelectionnee: string;
  listeOperateur: string[] = [];

  messageActif: boolean;
  messageErreur: Message[] = [];
  items: MenuItem[];
  home: MenuItem;

  constructor(private editionRapport: EditionRapportService, public datePipe: DatePipe, private browserService: BrowserService) {

  }

  ngOnInit(): void {
    const aujourdhui = new Date();

    this.messageErreur = [];
    this.messageActif = false;
    const premierJour = new Date(aujourdhui.getFullYear(), aujourdhui.getMonth(), 1);
    this.periodesSelectionnees = [premierJour, aujourdhui];
    this.recupererConsultation();

    this.statut = [
      {
        label: 'Terminée',
        value: 'TERMINEE'
      },
      {
        label: 'En cours',
        value: 'EN_COURS'
      },
      {
        label: 'Interrompue',
        value: 'TIMEOUT'
      }
    ];

    this.items = [
      {label: 'Edition rapport'},
      {label: 'Etat des consultations'},
    ];
    this.home = {icon: 'pi pi-home'};

  }


  showModalDialog() {
    this.displayModal = true;
  }


  /**
   * Récupère la liste des consultations
   */
  public recupererConsultation(): void {
    this.isLoading = true;
    const [dateDebut, dateFin] = this.periodesSelectionnees;
    this.messageErreur = [];
    this.messageActif = false;
    this.editionRapport.recupererListeConsultation(DateUtils.localToUtc(dateDebut),DateUtils.localToUtc(dateFin))
      .pipe(
        finalize(
          () => this.isLoading = false
        )
      ).subscribe(
      (consultations) => {
        this.consultations = consultations?.sort();
        console.log(this.consultations)
        this.listeOperateur = uniq(this.consultations.map(c => c.operateur)).sort();
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
   * imprimer la liste des consultations
   */
  public impremerConsultation(): void {
    this.isLoading = true;
    const [dateDebut, dateFin] = this.periodesSelectionnees;
    this.messageErreur = [];
    this.messageActif = false;
    this.browserService.ouvrirPdf(`${urls.imprimerConsultation}/${DateUtils.localToUtc(dateDebut).getTime()}/${DateUtils.localToUtc(dateFin).getTime()}`, () => this.isLoading = false, err => {
      this.messageErreur = [{ detail: err?.message, severity: 'error'}]  ;
      this.messageActif = true
    })
  };

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
    this.recupererConsultation();
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
      let Heading = [['Date de consultation', 'Opérateur', 'Numéro abonné', 'Durée de la session', 'Statut']];
      const wb = xlsx.utils.book_new();
      const ws = xlsx.utils.json_to_sheet([]);
      xlsx.utils.sheet_add_aoa(ws, Heading);
      xlsx.utils.sheet_add_json(ws, this.consultations, {origin: 'A2', skipHeader: true});
      xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');
      xlsx.writeFile(wb, 'consultations.xlsx');
    });
    this.displayModal = false
  }

  /**
   * Exporter les données au format Csv
   */
  public exportCSV(): void {
    import('xlsx').then(xlsx => {
      let HeadingCSV = [['Date de consultation', 'Opérateur', 'Numéro abonné', 'Durée de la session', 'Statut']];
      const wb = xlsx.utils.book_new();
      const ws = xlsx.utils.json_to_sheet([]);
      xlsx.utils.sheet_add_aoa(ws, HeadingCSV);
      xlsx.utils.sheet_add_json(ws, this.consultations, {origin: 'A2', skipHeader: true});
      xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');
      xlsx.writeFile(wb, 'consultations.csv');
    });
    this.displayModal = false
  }

  peutRechercher(): boolean {
    return this.periodesSelectionnees && this.periodesSelectionnees.length === 2 && this.periodesSelectionnees[0] != null && this.periodesSelectionnees[1] != null;
  }
}
