import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { urls } from '../model/urls';
import { Zone } from '../model/Zone';
import {CodeDesignation} from "../model/code-designation";

@Injectable({
  providedIn: 'root'
})
export class LieuVoteService {

  constructor(private httpClient:HttpClient) { }
  recupererListeLieuVote(codeCommunes :string): Observable<CodeDesignation[]> {
    let httpParams = new HttpParams();
      if (codeCommunes) {
        httpParams = httpParams.set('communes', String(codeCommunes));
      }
    return this.httpClient.get<Zone[]>(urls.lieuVote, { params: httpParams });
  }
}
