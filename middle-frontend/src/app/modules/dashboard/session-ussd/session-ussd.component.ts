import {Component, OnInit, ViewChild} from '@angular/core';
import {TableauBordService} from '../../shared/service/tableau-bord.service';
import {Calendar} from 'primeng/calendar';
import {ChartOptions} from '../../shared/model/chart-electeur-par-age';
import {TableauBordSessionUSSD} from '../../shared/model/tableau-bord-session-ussd.model';
import {TranslateService} from '@ngx-translate/core';
import {MenuItem, Message} from "primeng/api";
import {finalize} from "rxjs";
import { DateUtils } from '../../shared/Utils/dateUtils';

interface Status {
  libelle: string,
  code: string
}

@Component({
  selector: 'app-session-ussd',
  templateUrl: './session-ussd.component.html',
  styleUrls: ['./session-ussd.component.scss']
})
export class SessionUssdComponent implements OnInit {


  status: Status[];
  selectedStatus: string[];

  @ViewChild('periode')
  periode: Calendar;

  isLoading = false;
  periodesSelectionnees: Date[];

  tableau: TableauBordSessionUSSD;
  locale: any;
  sessionTotalOperateursChartOptions: Partial<ChartOptions>;
  sessionTermineeOperateursChartOptions: Partial<ChartOptions>;
  operateursTerminee: string[];
  operateursTotal: string[];
  operateursEnCours: string[];
  operateursTimeout: string[];
  couleursOperateurEnCours: string[] = [];
  couleursOperateurGlobal: string[] = [];
  couleursOperateurTermine: string[] = [];
  couleursOperateurTimeout: string[] = [];

  nombreTotalSession: number[];

  nombreSessionTerminee: number[];

  nombreSessionEnCours: number[];

  nombreSessionTimeOut: number[];
  sessionEnCoursOperateursChartOptions: Partial<ChartOptions>;
  sessionTimeoutOperateursChartOptions: Partial<ChartOptions>;
  messageActif: boolean;
  messageErreur: Message[] = [];
  items: MenuItem[];
  home: MenuItem;

  constructor(private tableauBordService: TableauBordService,
              private translateServie: TranslateService) {

    this.status = [{libelle: 'Terminé', code: 'T'},
      {libelle: 'En-Court', code: 'EC'},
      {libelle: 'Time-out', code: 'TO'}
    ];
  }

  ngOnInit(): void {
    this.translateServie.get('COMPONENTS.CALENDAR').subscribe(traduction => {
      this.locale = traduction;
    });
    this.messageErreur = [];
    this.messageActif = false;
    const aujourdhui = new Date();
    const premierJour = new Date(aujourdhui.getFullYear(), aujourdhui.getMonth(), 1);
    this.periodesSelectionnees = [premierJour, aujourdhui];
    this.rechercher();

    this.items = [
      {label: 'Tableau de bord'},
      {label: 'Session USSD'},
    ];
    this.home = {icon: 'pi pi-home'};
  }


  /**
   * Cette fonction permet de valider les filtres
   */
  public rechercher(): void {
    this.isLoading = true;
    const [dateDebut, dateFin] = this.periodesSelectionnees;
    this.messageErreur = [];
    this.messageActif = false;
    this.tableauBordService.recupererTableauDeBordSessionUSSD(DateUtils.localToUtc(dateDebut), DateUtils.localToUtc(dateFin))
      .pipe(
        finalize(
          () => this.isLoading = false
        )
      ).subscribe(
      (tableau) => {
        this.tableau = tableau;
        //initialiser les données
        this.nombreTotalSession = [];
        this.operateursTotal = [];
        this.nombreSessionTerminee = [];
        this.operateursTerminee = [];
        this.nombreSessionEnCours = [];
        this.operateursEnCours = [];
        this.couleursOperateurEnCours = [];
        this.couleursOperateurGlobal = [];
          this.couleursOperateurTermine = [];
          this.couleursOperateurTimeout = [];
          this.nombreSessionTimeOut = [];
          this.operateursTimeout = [];


          //charger les données
          for (let element of this.tableau.totalSessionParOperateur) {
            this.nombreTotalSession.push(element.nombreSession);
            this.operateursTotal.push(element.operateur);
            this.couleursOperateurGlobal.push(element.codeCouleur);
          }

          for (let element of this.tableau.sessionTermineeParOperateur) {
            this.nombreSessionTerminee.push(element.nombreSession);
            this.operateursTerminee.push(element.operateur);
            this.couleursOperateurTermine.push(element.codeCouleur);
          }

          for (let element of this.tableau.sessionEnCoursParOperateur) {
            this.nombreSessionEnCours.push(element.nombreSession);
            this.operateursEnCours.push(element.operateur);
            this.couleursOperateurEnCours.push(element.codeCouleur);
          }

          for (let element of this.tableau.sessionTimeoutParOperateur) {
            this.nombreSessionTimeOut.push(element.nombreSession);
            this.operateursTimeout.push(element.operateur);
            this.couleursOperateurTimeout.push(element.codeCouleur);
          }

        this.construireDiagrammeSessionTotalParOperateurs();
        this.construireDiagrammeSessionTermineeParOperateurs();
        this.construireDiagrammeSessionEnCoursParOperateurs();
        this.construireDiagrammeSessionTimeoutParOperateurs();
      },

      (err) => {
        this.messageErreur = [{detail: err.error?.message, severity: 'error'}];
        this.messageActif = true;
      }
    );
  }

  /**
   * Permet de vider toutes les valeurs des filtres
   */
  viderfiltre(): void {

    this.periodesSelectionnees = [];

  }

  onSelectDate() {
    const [dateMin, dateMax] = this.periodesSelectionnees ? this.periodesSelectionnees : [];
    const dateFin = dateMax ? String(new Date(dateMax)) : null;
    if (dateFin != null) {
      this.periode.hideOverlay();
    }
  }

  peutRechercher(): boolean {
    return this.periodesSelectionnees && this.periodesSelectionnees.length === 2 && this.periodesSelectionnees[0] != null && this.periodesSelectionnees[1] != null;
  }

  /**
   * Histogramme du total de session par operateur.
   */
  private construireDiagrammeSessionTotalParOperateurs(): void {
    this.sessionTotalOperateursChartOptions = {
      series: [
        {
          name: 'Nombre total de sessions',
          data: this.nombreTotalSession,
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
        categories: this.operateursTotal,
        labels: {
          rotate: -45,
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
        text: 'Nombre global de sessions par opérateur',
        style: {
          fontSize: '15px',
        }
      }
    };

  }

  /**
   * Histogramme du total de sessions en cours par operateur.
   */
  private construireDiagrammeSessionEnCoursParOperateurs(): void {
    this.sessionEnCoursOperateursChartOptions = {
      series: [
        {
          name: 'Nombre de sessions en cours',
          data: this.nombreSessionEnCours,
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
        categories: this.operateursEnCours,
        labels: {
          rotate: -45,
          style: {
            fontSize: '15px',
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
        text: 'Nombre de sessions en cours par opérateur',
        style: {
          fontSize: '15px',
        }
      }
    };

  }

  /**
   * Histogramme du total de sessions terminnées par operateur.
   */
  private construireDiagrammeSessionTermineeParOperateurs(): void {
    this.sessionTermineeOperateursChartOptions = {
      series: [
        {
          name: 'Nombre de sessions terminées',
          data: this.nombreSessionTerminee,
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
      plotOptions: {
        bar: {
          horizontal: true,
          columnWidth: '35%',
          distributed: true,
        },
      },
      dataLabels: {
        enabled: true,
      },
      xaxis: {
        type: 'category',
        categories: this.operateursTerminee,
        labels: {
          rotate: -45,
          style: {
            fontSize: '15px',
            fontWeight: 'bold'
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
        text: 'Nombre de sessions terminées par opérateur',
        style: {
          fontSize: '15px',
        }
      }
    };
  }

  private construireDiagrammeSessionTimeoutParOperateurs(): void {
    this.sessionTimeoutOperateursChartOptions = {
      series: [
        {
          name: 'Nombre de sessions interrompues',
          data: this.nombreSessionTimeOut,
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
        categories: this.operateursTimeout,
        labels: {
          rotate: -45,
          style: {
            fontSize: '15px',
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
        text: 'Nombre de sessions interrompues par opérateur',
        style: {
          fontSize: '15px',
        }
      }
    };

  }
}
