import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sujet, SujetCreate } from '../models/sujet.model';

@Injectable({ providedIn: 'root' })
export class SujetService {
  private apiUrl = 'http://localhost:8080/api/sujets';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Sujet[]> {
    return this.http.get<Sujet[]>(this.apiUrl);
  }

  getById(id: number): Observable<Sujet> {
    return this.http.get<Sujet>(`${this.apiUrl}/${id}`);
  }

  create(sujet: SujetCreate): Observable<Sujet> {
    return this.http.post<Sujet>(this.apiUrl, sujet);
  }

  valider(id: number): Observable<Sujet> {
    return this.http.put<Sujet>(`${this.apiUrl}/${id}/valider`, {});
  }
}
