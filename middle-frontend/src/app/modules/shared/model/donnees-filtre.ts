import { HttpParams } from '@angular/common/http';

export class DonneesFiltre {

	departement: string;
	sousPrefecture: string;
	commune: string;
	bureauVote: string;

	static initialiserDonneesFiltres(): DonneesFiltre {
		const donneeFitres: DonneesFiltre = new DonneesFiltre();
		donneeFitres.departement = localStorage.getItem('codeDepartement');
		donneeFitres.sousPrefecture = localStorage.getItem('codeSousPrefecture');
		donneeFitres.commune = localStorage.getItem('codeCommune');
		donneeFitres.bureauVote = localStorage.getItem('codeBureauVote');
		return donneeFitres;
	}

	/**
	 * Construit les paramètres de la requête HTTP.
	 *
	 * @param codeDepartement les codes des Departements.
	 * @param codeSousPrefecture les codes des SousPrefectures.
	 * @param codeCommune les codes des communes.
	 * @param codeBureauVote les codes des bureaux de votes.
	 */
	static construireParametres(codeDepartement?: string, codeSousPrefecture?: string, codeCommune?: string, codeBureauVote?: string
	): HttpParams {
		let httpParams = new HttpParams();

		if (codeDepartement) {
			httpParams = httpParams.set('departement', codeDepartement);
		}
		if (codeSousPrefecture) {
			httpParams = httpParams.set('sousPrefecture', codeSousPrefecture);
		}
		if (codeCommune) {
			httpParams = httpParams.set('commune', codeCommune);
		}
		if (codeBureauVote) {
			httpParams = httpParams.set('bureauVote', codeBureauVote);
		}

		return httpParams;
	}
}
