import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {DonneesFiltre} from "../model/donnees-filtre";
import {Observable} from "rxjs";
import {TableauBord} from "../model/tableau-bord.model";
import {urls} from "../model/urls";
import {Parametrage} from "../model/parametrage.model";
import {CodeDesignation} from "../model/code-designation";

@Injectable({
  providedIn: 'root'
})
export class ParametrageService {

  constructor(private httpClient: HttpClient) {
  }

  /**
   * Recupère la liste des paramètres de l'application
   */
  lister(): Observable<Parametrage[]> {
    return this.httpClient.get<Parametrage[]>(urls.parametrage);
  }

  listerImprimante(): Observable<string[]> {
    return this.httpClient.get<string[]>(urls.listerImprimante);
  }

  modifier(parametrage: Parametrage): Observable<Parametrage> {
    return this.httpClient.put<Parametrage>(urls.parametrage, parametrage);
  }

  deposerFichier(file: File, type: boolean): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('type', String(type))
    return this.httpClient.post<any>(urls.depotFichier, formData);
  }

  processFichier(): Observable<CodeDesignation[]> {
    return this.httpClient.post<any>(urls.processFichier, {});
  }
}
