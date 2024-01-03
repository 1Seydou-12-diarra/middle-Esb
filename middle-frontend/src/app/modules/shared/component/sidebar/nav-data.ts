import { INavBarData } from './helper';

export class NavbarData {

  private static menuTableauBord: INavBarData = {
    routerlink: 'tableau-de-bord',
    icon: 'fa fa-line-chart',
    label: 'TABLEAU DE BORD',
    items: [
      {
        routerlink: 'tableau-de-bord/listeElectorale',
        label: "Liste Electorale",
        icon: 'pi pi-chart-line',
      },
      {
        routerlink: 'tableau-de-bord/sessionUssd',
        label: "Session USSD",
        icon: 'pi pi-home',
      }
    ]
  };

  private static menuEditionRapport: INavBarData = {
    routerlink: 'edition-rapport',
    icon: 'fa fa-pencil-square-o',
    label: 'EDITION RAPPORT',
    items: [
      {
        routerlink: 'edition-rapport/etat-consultations',
        label: "Etat des consultations",
      }
    ]
  };

  private static menuEditionRapportSuperAdmin: INavBarData = {
    routerlink: 'edition-rapport',
    icon: 'fa fa-pencil-square-o',
    label: 'EDITION RAPPORT',
    items: [
      {
        routerlink: 'edition-rapport/etat-consultations',
        label: "Etat des consultations",
      },
      {
        routerlink: 'edition-rapport/chiffre-affaires',
        label: "Chiffre d'affaires généré",
      }
    ]
  };

  private static menuParametreGeneraux: INavBarData = {
    routerlink: 'parametrage',
    icon: 'pi pi-wrench',
    label: 'PARAMETRAGE',
    items: [
      {
        routerlink: 'parametrage/lister-parametre',
        label: "Paramètres généraux"
      },
      {
        routerlink: 'parametrage/chargement-fichiers',
        label: "Chargement de fichiers",
      },

    ]
  };

  private static menuUtilisateurs: INavBarData = {
    routerlink: 'utilisateurs',
    icon: 'pi pi-users',
    label: 'UTILISATEURS'
  };

  private static menuApplications: INavBarData = {
    routerlink: 'applications',
    icon: 'pi  pi-server',
    label: 'APPLICATIONS'
  };





  static menusPourAdmin(): INavBarData[] {
    return [this.menuTableauBord, this.menuEditionRapport, this.menuParametreGeneraux, this.menuApplications, this.menuUtilisateurs];
  }

  static menusPourSuperAdmin(): INavBarData[] {
    return [this.menuTableauBord, this.menuEditionRapportSuperAdmin, this.menuParametreGeneraux, this.menuUtilisateurs];
  }

  static menusPourUtilisateurs(): INavBarData[] {
    return [this.menuTableauBord, this.menuEditionRapport];
  }
}
