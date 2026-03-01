import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Affectation } from '../models/affectation.model';
import { environment } from '../../../environments/environment';

export interface AffectationManuelleRequest {
  etudiantId: number;
  sujetId: number;
  encadrantId?: number;
}

@Injectable({ providedIn: 'root' })
export class AffectationService {
  private apiUrl = `${environment.apiUrl}/affectations`;

  constructor(private http: HttpClient) {}

  getMonPFE(): Observable<Affectation> {
    return this.http.get<Affectation>(`${this.apiUrl}/mon-pfe`);
  }

  getMesEncadrements(): Observable<Affectation[]> {
    return this.http.get<Affectation[]>(`${this.apiUrl}/mes-encadrements`);
  }

  affecterManuel(request: AffectationManuelleRequest): Observable<Affectation> {
    let params = new HttpParams()
      .set('etudiantId', request.etudiantId.toString())
      .set('sujetId', request.sujetId.toString());
    if (request.encadrantId) {
      params = params.set('encadrantId', request.encadrantId.toString());
    }
    return this.http.post<Affectation>(`${this.apiUrl}/manuelle`, null, { params });
  }

  affecterAuto(): Observable<Affectation[]> {
    return this.http.post<Affectation[]>(`${this.apiUrl}/automatique`, {});
  }

  terminer(id: number): Observable<Affectation> {
    return this.http.put<Affectation>(`${this.apiUrl}/${id}/terminer`, {});
  }
}
