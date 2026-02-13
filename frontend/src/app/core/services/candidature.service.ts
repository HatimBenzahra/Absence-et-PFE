import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Candidature, CandidatureCreate } from '../models/candidature.model';

@Injectable({ providedIn: 'root' })
export class CandidatureService {
  private apiUrl = 'http://localhost:8080/api/candidatures';

  constructor(private http: HttpClient) {}

  getMyCandidatures(): Observable<Candidature[]> {
    return this.http.get<Candidature[]>(`${this.apiUrl}/me`);
  }

  create(candidature: CandidatureCreate): Observable<Candidature> {
    return this.http.post<Candidature>(this.apiUrl, candidature);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
