import { MoovCharges } from "./MoovCharges";
import { MtnCharges } from "./MtnCharges";
import { OrangeCharges } from "./OrangeCharges";

export class ChiffreAffaire {
	id: number;
	dateConsultation: string;
	operateur: string;
  nombresConsultations: number;
  coutUnitairesFacture: number;
  recetteTotal: number;
  totalChargesADeduire: number;
  pourcentageTotaleCharges: number;
  montantHorsTaxe: number;
  pourcentageSharing: number;
  revenuOperateur: number;
  revenuEburtis: number;
  mtnCharges : MtnCharges;
  orangeCharges : OrangeCharges;
  moovCharges : MoovCharges

}
