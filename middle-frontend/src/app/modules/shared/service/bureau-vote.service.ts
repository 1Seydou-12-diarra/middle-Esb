import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { urls } from '../model/urls';
import { Zone } from '../model/Zone';
import {CodeDesignation} from "../model/code-designation";

@Injectable({
  providedIn: 'root'
})
export class BureauVoteService {

  constructor(private httpClient:HttpClient) { }
  recupererListeBureauVote(codeLieuVotes :string): Observable<CodeDesignation[]> {
    let httpParams = new HttpParams();
      if (codeLieuVotes) {
        httpParams = httpParams.set('lieuVotes', String(codeLieuVotes));
      }
    return this.httpClient.get<Zone[]>(urls.bureauVote, { params: httpParams });
  }
}
