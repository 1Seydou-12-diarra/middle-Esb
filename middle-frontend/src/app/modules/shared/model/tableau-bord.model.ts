import { ElecteurEtrangers } from "./ElecteurEtrangers";
import { ElecteurParTrancheAge } from "./ElecteurParTrancheAge";


export class TableauBord {
	totalElecteurs: number;
	totalHommesElecteurs: number;
	totalFemmesElecteurs: number;
	totalElecteursDiaspora: number;
	electeurParTrancheAge: ElecteurParTrancheAge[];
	electeurEtrangers:ElecteurEtrangers[];
	nouveauInscrits: number;
}
