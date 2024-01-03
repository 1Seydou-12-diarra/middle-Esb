import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { urls } from '../model/urls';
import { Observable } from 'rxjs';
import { Application } from 'src/app/modules/shared/model/Application';
import { TableauApplication } from '../model/TableauApplication';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  constructor(private httpClient: HttpClient) { }
  /**
   * Lister le tableau des application
   * @returns 
   */

  listeApplication(): Observable<TableauApplication> {
    return this.httpClient.get<TableauApplication>(urls.listeApplication);
  }

  /**
   * enregistrer ou modifierApplication
   * @param application 
   * @returns 
   */

  ajouterOuModifierApplication(application: Application) {

    return this.httpClient.post(urls.ajouterOuModifierApplication, application);
  }


}
