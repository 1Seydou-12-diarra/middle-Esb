import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {map, Observable} from 'rxjs';
import { ChiffreAffaire } from '../model/ChiffreAffaire';
import { Consultation } from '../model/Consultation';
import { urls } from '../model/urls';

@Injectable({
	providedIn: 'root'
})
export class EditionRapportService {

	constructor(private httpClient: HttpClient) {
	}

	/**
	 * Récuperer la liste des consultations
	 * @return Consultation[]
	 */
	recupererListeConsultation(dateDebut: Date, dateFin: Date): Observable<Consultation[]> {
		const httpParams = new HttpParams()
				.set('debut', dateDebut.getTime())
				.set('fin', dateFin.getTime());
		return this.httpClient.get<Consultation[]>(urls.consultation, { params: httpParams }).pipe(
      map(consultations => consultations.map(
        consultation => new Consultation().deserialize(consultation)
      ))
    );
	}

	/**
	 * Récuperer la liste des chiffres d'affaires
	 * @return ChiffreAffaire[]
	 */
	recupererListeChiffreAffaire(dateDebut: Date, dateFin: Date): Observable<ChiffreAffaire[]> {
		const httpParams = new HttpParams()
		.set('debut', dateDebut.getTime())
		.set('fin', dateFin.getTime());
		return this.httpClient.get<ChiffreAffaire[]>(urls.chiffreAffaire, { params: httpParams });
	}
}
