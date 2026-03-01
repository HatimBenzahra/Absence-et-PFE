import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Statistiques } from '../models/statistiques.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class StatistiquesService {
  private apiUrl = `${environment.apiUrl}/statistiques`;

  constructor(private http: HttpClient) {}

  getByEtudiant(etudiantId: number): Observable<Statistiques> {
    return this.http.get<Statistiques>(`${this.apiUrl}/etudiant/${etudiantId}`);
  }

  getByGroupe(groupe: string): Observable<Statistiques> {
    return this.http.get<Statistiques>(`${this.apiUrl}/groupe/${groupe}`);
  }

  getByMatiere(matiere: string): Observable<Statistiques> {
    return this.http.get<Statistiques>(`${this.apiUrl}/matiere/${matiere}`);
  }
}
