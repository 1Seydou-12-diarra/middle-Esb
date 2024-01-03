import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DonneesFiltre } from '../model/donnees-filtre';
import { TableauBord } from '../model/tableau-bord.model';
import { urls } from '../model/urls';
import { TableauBordSessionUSSD } from '../model/tableau-bord-session-ussd.model';

@Injectable({
	providedIn: 'root'
})
export class TableauBordService {
	constructor(private httpClient: HttpClient) {
	}

	/**
	 * Recupère le tableau de bord de la liste électorale
	 */
	recupererTableauDeBordListeElectorale(donneesFiltre: DonneesFiltre): Observable<TableauBord> {
		const httpParams = DonneesFiltre.construireParametres(
				donneesFiltre.departement,
				donneesFiltre.sousPrefecture,
				donneesFiltre.commune,
				donneesFiltre.bureauVote
		);
		return this.httpClient.get<TableauBord>(urls.tableauBordListeElectorale, { params: httpParams });
	}

	/**
	 * Recupère le tableau de bord des sessions USSD
	 */
	recupererTableauDeBordSessionUSSD(dateDebut: Date, dateFin: Date): Observable<TableauBordSessionUSSD> {
		const httpParams = new HttpParams()
				.set('debut', dateDebut.getTime())
				.set('fin', dateFin.getTime());
		return this.httpClient.get<TableauBordSessionUSSD>(urls.tableauBordSessionUssd, { params: httpParams });
	}

}
