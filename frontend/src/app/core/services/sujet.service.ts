import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sujet, SujetCreate } from '../models/sujet.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SujetService {
  private apiUrl = `${environment.apiUrl}/sujets`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Sujet[]> {
    return this.http.get<Sujet[]>(this.apiUrl);
  }

  getEnAttente(): Observable<Sujet[]> {
    return this.http.get<Sujet[]>(`${this.apiUrl}/en-attente`);
  }

  getById(id: number): Observable<Sujet> {
    return this.http.get<Sujet>(`${this.apiUrl}/${id}`);
  }

  create(sujet: SujetCreate): Observable<Sujet> {
    return this.http.post<Sujet>(this.apiUrl, sujet);
  }

  getMesSujets(): Observable<Sujet[]> {
    return this.http.get<Sujet[]>(`${this.apiUrl}/mes-sujets`);
  }

  valider(id: number): Observable<Sujet> {
    return this.http.put<Sujet>(`${this.apiUrl}/${id}/valider`, {});
  }

  refuser(id: number): Observable<Sujet> {
    return this.http.put<Sujet>(`${this.apiUrl}/${id}/refuser`, {});
  }
}
