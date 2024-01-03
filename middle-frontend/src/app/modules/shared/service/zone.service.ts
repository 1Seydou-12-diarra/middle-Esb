import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { urls } from '../model/urls';
import { Zone } from '../model/Zone';

@Injectable({
  providedIn: 'root'
})
export class ZoneService {

  constructor(private httpClient:HttpClient) { }

    /**
	 * Récuperer la liste des departements
	 * @return Departement[]
	 */
	recupererListeDepartement(): Observable<Zone[]> {
		return this.httpClient.get<Zone[]>(urls.departement);
	}

   /**
   * Récuperer la liste des SousPrefectures
   * @return SousPrefecture[]
   */
   recupererListeSousPrefecture(codesDepartements:string): Observable<Zone[]> {
    let httpParams = new HttpParams();
      if (codesDepartements) {
        httpParams = httpParams.set('departements', String(codesDepartements));
      }
    return this.httpClient.get<Zone[]>(urls.sousPrefectures, { params: httpParams });
  }
   /**
   * Récuperer la liste des Commune
   * @return Commune[]
   */
   recupererListeCommune(codeSousPrefecture:string): Observable<Zone[]> {
    let httpParams = new HttpParams();
      if (codeSousPrefecture) {
        httpParams = httpParams.set('sous-prefecture', String(codeSousPrefecture));
      }
    return this.httpClient.get<Zone[]>(urls.commune, { params: httpParams });
  }


  /**
   * Récuperer la liste des Bureaux de vote
   * @return BureauVote[]
   */
  recupererListeBureauVote(codeCommune:string): Observable<Zone[]> {
    let httpParams = new HttpParams();
      if (codeCommune) {
        httpParams = httpParams.set('communes', String(codeCommune));
      }
    return this.httpClient.get<Zone[]>(urls.bureauVote, { params: httpParams });
  }
}
