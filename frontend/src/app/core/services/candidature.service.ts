import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Candidature, CandidatureCreate } from '../models/candidature.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CandidatureService {
  private apiUrl = `${environment.apiUrl}/candidatures`;

  constructor(private http: HttpClient) {}

  getMyCandidatures(): Observable<Candidature[]> {
    return this.http.get<Candidature[]>(`${this.apiUrl}/mes-candidatures`);
  }

  create(candidature: CandidatureCreate): Observable<Candidature> {
    return this.http.post<Candidature>(this.apiUrl, candidature);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getCandidaturesBySujet(sujetId: number): Observable<Candidature[]> {
    return this.http.get<Candidature[]>(`${this.apiUrl}/sujet/${sujetId}`);
  }

  accepter(id: number): Observable<Candidature> {
    return this.http.patch<Candidature>(`${this.apiUrl}/${id}/accepter`, {});
  }

  refuser(id: number): Observable<Candidature> {
    return this.http.patch<Candidature>(`${this.apiUrl}/${id}/refuser`, {});
  }
}
