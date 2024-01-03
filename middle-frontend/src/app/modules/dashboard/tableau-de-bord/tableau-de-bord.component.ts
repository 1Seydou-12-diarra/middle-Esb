import {Component, ViewChild} from '@angular/core';
import {ChartComponent} from "ng-apexcharts";
import {MenuItem, Message, SelectItem} from 'primeng/api';
import {ChartOptions} from '../../shared/model/chart-electeur-par-age';

import {DonneesFiltre} from '../../shared/model/donnees-filtre';
import {TableauBord} from '../../shared/model/tableau-bord.model';
import {Zone} from '../../shared/model/Zone';
import {TableauBordService} from '../../shared/service/tableau-bord.service';
import {ZoneService} from '../../shared/service/zone.service';
import {CodeDesignation} from "../../shared/model/code-designation";
import {LieuVoteService} from "../../shared/service/lieu-vote.service";
import {BureauVoteService} from "../../shared/service/bureau-vote.service";
import {finalize} from "rxjs";

@Component({
  selector: 'app-tableau-de-bord',
  templateUrl: './tableau-de-bord.component.html',
  styleUrls: ['./tableau-de-bord.component.scss']
})
export class TableauDeBordComponent {

  @ViewChild('chart') chart: ChartComponent;
  electeurParTrancheDageChartOptions: Partial<ChartOptions>;
  electeursParSexeChartOptions: Partial<ChartOptions>;
  electeursEtrangerChartOptions: Partial<ChartOptions>;
  tableauBord: TableauBord;
  trancheAge: string[] = [];
  electeursParSexe: number[] = [];
  nombreParAge: number[] = [];
  nombreElecteursEtranger: number[] = [];
  nombreFemmesEtranger: number[] = []
  nombreHommesEtranger: number[] = []
  paysEtranger: String[] = [];
  codeDepart: String[];
  isDiaspora: boolean = false;
  departements: Zone[];
  sousPrefectures: Zone[];
  communes: Zone[];
  bureauVotes: CodeDesignation[];
  lieuVotes: CodeDesignation[];

  choixFiltreDepartements: SelectItem[];
  choixFiltreCommunes: SelectItem[];
  choixFiltreSousPrefectures: SelectItem[];
  choixFiltreBureauVotes: SelectItem[];

  sousPrefecturesSelectionnees: Zone[];
  departementsSelectionnees: Zone[];
  communeSelectionnees: Zone[];
  bureauVoteSelectionnees: CodeDesignation[];
  totalElecteursDiaspora: number;
  totalHommesDiaspora: number;
  totalFemmesDiaspora: number;

  donneeFitres: DonneesFiltre = DonneesFiltre.initialiserDonneesFiltres();

  isLoading = false;
  choixFiltreLieuVotes: SelectItem[];
  lieuVoteSelectionnees: CodeDesignation[];

  messageActif: boolean;
  messageErreur: Message[] = [];
  items: MenuItem[];
  home: MenuItem;

  constructor(private tableauDeBord: TableauBordService,
              private zoneService: ZoneService,
              private lieuVoteService: LieuVoteService,
              private bureauVoteService: BureauVoteService
  ) {
  }

  ngOnInit(): void {
    //this.recupererDonneesTableauDeBord();
    this.initialiserTableau();
    this.items = [
      {label: 'Tableau de bord'},
      {label: 'Liste Electorale'},
    ];
    this.home = {icon: 'pi pi-home'};
  }

  initialiserTableau() {
    this.isLoading = true;

    this.messageErreur = [];
    this.messageActif = false;
    this.zoneService.recupererListeDepartement()
      .pipe(
        finalize(
          () => this.isLoading = false
        )
      ).subscribe(
      (departements) => {
        this.departements = departements?.sort();
        this.choixFiltreDepartements = this.construireOptionfiltres(this.departements)
        this.departementsSelectionnees = this.departements;
        this.validerfiltre();
        this.onSelectionDepartement();
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
   * Contruit les options d'un multiselect.
   * @param data la liste des données source.
   */
  construireOptionfiltres(data: any[]): SelectItem[] {
    return data?.map(objet => {
      return {
        code: objet.code,
        value: objet.designation,
        id: objet.id
      };
    });
  }

  /**
   * Se déclenche lorsqu'un departement est selectionné
   */
  public onSelectionDepartement(values?: any): void {
    this.sousPrefecturesSelectionnees = [];
    this.communeSelectionnees = [];
    this.lieuVoteSelectionnees = [];
    this.bureauVoteSelectionnees = [];
    if (this.departementsSelectionnees?.length) {
      this.recupererSousPrefecture();
    }
  }

  /**
   * Récupère la liste des sous-prefecture
   */
  recupererSousPrefecture(): void {
    const codesDepartements = this.departementsSelectionnees?.map(r => r.code).join(',');
    this.messageErreur = [];
    this.messageActif = false;
    this.zoneService.recupererListeSousPrefecture(codesDepartements)
      .pipe(
        finalize(
          () => this.isLoading = false
        )
      ).subscribe(
      (sousPrefectures) => {
        this.sousPrefectures = sousPrefectures?.sort();
        this.choixFiltreSousPrefectures = this.construireOptionfiltres(this.sousPrefectures)
      },
      err => {
        if (err.error?.message) {
          this.messageErreur = [{detail: err.error?.message, severity: 'error'}];
          this.messageActif = true;
        }
      }
    );

  }

  /**
   * Retourne true s'il faute désactiver le bouton de recherche.
   */
  desactiverBoutonFiltre(): boolean {
    return !this.departementsSelectionnees || this.departementsSelectionnees.length === 0;
  }

  /**
   * Cette fonction permet de valider les filtres
   */
  public validerfiltre(): void {
    const donneesFiltre = new DonneesFiltre();
    donneesFiltre.departement = this.departementsSelectionnees?.map(r => r.code).join(',');
    donneesFiltre.sousPrefecture = this.sousPrefecturesSelectionnees?.map(c => c.code).join(',');
    donneesFiltre.commune = this.communeSelectionnees?.map(c => c.code).join(',');
    donneesFiltre.bureauVote = this.bureauVoteSelectionnees?.map(c => c.code).join(',');
    this.recupererDonneesTableauDeBord(donneesFiltre)
  }


  /**
   * Récupère les données du tableau de bord
   */
  recupererDonneesTableauDeBord(donneeFiltres: DonneesFiltre): void {
    this.isLoading = true;

    this.isDiaspora = false;
    this.messageErreur = [];
    this.messageActif = false;
    this.codeDepart = donneeFiltres.departement.split(",")
    for (let element of this.codeDepart) {
      if (element == "999") {
        this.isDiaspora = true;
      }
    }
    this.tableauDeBord.recupererTableauDeBordListeElectorale(donneeFiltres)
      .pipe(
        finalize(
          () => this.isLoading = false
        )
      ).subscribe(
      (data) => {
        this.tableauBord = data;
        //initialiser les données
        this.trancheAge = [];
        this.nombreParAge = [];
        this.electeursParSexe = [];
        this.paysEtranger = [];
        this.nombreElecteursEtranger = [];
        this.nombreHommesEtranger = [];
        this.nombreFemmesEtranger = [];
        this.totalFemmesDiaspora = 0;
        this.totalHommesDiaspora = 0;
        this.totalElecteursDiaspora = 0;

        //charger les données
        this.electeursParSexe.push(this.tableauBord.totalHommesElecteurs);
        this.electeursParSexe.push(this.tableauBord.totalFemmesElecteurs);
        for (let element of this.tableauBord.electeurParTrancheAge) {
          this.trancheAge.push(element.tranche);
          this.nombreParAge.push(element.nombre);
        }
        //this.electeursEntranger=this.tableauBord.electeurEtrangers;

        for (let element of this.tableauBord.electeurEtrangers) {
          this.paysEtranger.push(element.pays);
          this.nombreElecteursEtranger.push(element.nombreElecteurs);
          this.nombreHommesEtranger.push(element.nombreHommes);
          this.nombreFemmesEtranger.push(element.nombreFemmes);
          this.totalHommesDiaspora += element.nombreHommes;
          this.totalFemmesDiaspora += element.nombreFemmes;
          this.totalElecteursDiaspora += element.nombreElecteurs;
        }

        this.construireDiagrammeElecteurParTrancheDage();
        this.construireDiagrammeElecteursParSexe();
        this.construireDiagrammeElecteursEtranger();
      },
      err => {
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
    this.departementsSelectionnees = [];
    this.sousPrefecturesSelectionnees = [];
    this.communeSelectionnees = [];
    this.bureauVoteSelectionnees = [];
  }

  public onSelectionSousPrefecture(value: any) {
    this.communeSelectionnees = [];
    this.lieuVoteSelectionnees = [];
    this.bureauVoteSelectionnees = [];
    if (this.sousPrefecturesSelectionnees?.length) {
      this.recupererCommune();
    }
  }

  public recupererCommune() {
    const codeSousPrefecture = this.sousPrefecturesSelectionnees?.map(r => r.code).join(',');
    this.messageErreur = [];
    this.messageActif = false;
    this.zoneService.recupererListeCommune(codeSousPrefecture)
      .pipe(
        finalize(
          () => this.isLoading = false
        )
      ).subscribe(
      (communes) => {
        this.communes = communes?.sort();
        this.choixFiltreCommunes = this.construireOptionfiltres(this.communes)
      },
      err => {
        if (err.error?.message) {
          this.messageErreur = [{detail: err.error?.message, severity: 'error'}];
          this.messageActif = true;
        }
      }
    );
  }

  public onSelectionCommune(value: any) {
    this.lieuVoteSelectionnees = [];
    this.bureauVoteSelectionnees = [];
    if (this.communeSelectionnees?.length) {
      this.recupererLieuVote();
    }
  }

  onSelectionLieuVote(value) {
    this.bureauVoteSelectionnees = [];
    if (this.lieuVoteSelectionnees?.length) {
      this.recupererBureauVote();
    }
  }

  public recupererLieuVote() {
    const codeCommune = this.communeSelectionnees?.map(r => r.code).join(',');
    this.messageErreur = [];
    this.messageActif = false;
    this.lieuVoteService.recupererListeLieuVote(codeCommune)
      .pipe(
        finalize(
          () => this.isLoading = false
        )
      ).subscribe(
      (lieuVote) => {
        this.lieuVotes = lieuVote?.sort((l1, l2) => l1.designation.localeCompare(l2.designation));
        this.choixFiltreLieuVotes = this.construireOptionfiltres(this.lieuVotes)
      },
      err => {
        if (err.error?.message) {
          this.messageErreur = [{detail: err.error?.message, severity: 'error'}];
          this.messageActif = true;
        }
      }
    );
  }

  public recupererBureauVote() {
    const codeLieuVote = this.lieuVoteSelectionnees?.map(r => r.code).join(',');
    this.messageErreur = [];
    this.messageActif = false;
    this.bureauVoteService.recupererListeBureauVote(codeLieuVote)
      .pipe(
        finalize(
          () => this.isLoading = false
        )
      ).subscribe(
      (bureauVotes) => {
        this.bureauVotes = bureauVotes?.sort();
        this.choixFiltreBureauVotes = this.construireOptionfiltres(this.bureauVotes)
      },
      err => {
        if (err.error?.message) {
          this.messageErreur = err.error?.message;
          this.messageActif = true;
        }
      }
    );
  }

  /**
   * Histogramme du nombre d'electeurspar tranche d'age.
   */
  private construireDiagrammeElecteurParTrancheDage(): void {
    this.electeurParTrancheDageChartOptions = {
      series: [
        {
          name: 'électeurs',
          data: this.nombreParAge,
        }
      ],
      chart: {
        type: 'bar',
        height: 250,
        stacked: false,
        toolbar: {
          show: true,
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: 'bottom',
              offsetX: -10,
              offsetY: 0,
            },
          },
        },
      ],
      colors: [
        "#E67B3B"
      ],
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '35%',
          distributed: true
        },
      },
      dataLabels: {
        enabled: true,
      },
      xaxis: {
        type: 'category',
        categories: this.trancheAge,
        labels: {
          style: {
            fontSize: '15px'
          }
        }
      },
      legend: {
        show: false,
      },
      tooltip: {
        theme: 'dark',
        marker: {
          show: true,
        },
        x: {
          show: true,
        },
      },
      title: {
        text: "Electeurs par tranche d'âge",
        style: {
          fontSize: '15px',
        }
      }
    };
  }

  /**
   * Diagramme circulaire des participations par sexe.
   */
  private construireDiagrammeElecteursParSexe(): void {
    this.electeursParSexeChartOptions = {
      serie: this.electeursParSexe,
      chart: {
        width: '90%',
        type: 'pie',
        height: 250
      },
      colors: ['#08D110', '#E67B3B'],
      labels: [
        'Masculin',
        'Féminin'
      ],
      title: {
        text: 'Electeurs par sexe',
        style: {
          fontSize: '15px',
        }
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: 'bottom'
            }
          }
        }
      ]
    };
  }

  /**
   * Diagramme des electeurs  a l'etranger.
   */
  private construireDiagrammeElecteursEtranger(): void {
    this.electeursEtrangerChartOptions = {
      series: [
        {
          name: "Nombre électeurs",
          type: "column",
          data: this.nombreElecteursEtranger
        },
        {
          name: "Nombre hommes",
          type: "line",
          data: this.nombreHommesEtranger
        },
        {
          name: "Nombre femmes",
          type: "line",
          data: this.nombreFemmesEtranger
        }
      ],
      chart: {
        height: 250,
        type: "line",
        toolbar: {
          tools: {
            zoom: false,
            zoomin: false,
            zoomout: false,
            pan: false,
            reset: false
          }
        }
      },
      stroke: {
        width: [0, 10]
      },
      title: {
        text: "Répartition des électeurs par pays",
        style: {
          fontSize: '15px',
        },

      },
      dataLabels: {
        enabled: true,
        enabledOnSeries: [1, 2]
      },
      labels: this.paysEtranger,
      xaxis: {
        categories: this.paysEtranger
      },
      yaxis: [
        {
          title: {
            text: "Nombre électeurs",
            style: {
              fontSize: '11px',
            }
          }
        },
        {
          opposite: true,
          title: {
            text: 'Nombre hommes/femmes',
            style: {
              fontSize: '11px'
            }
          }
        }
      ]
    };
  }

}
