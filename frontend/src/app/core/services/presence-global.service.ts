import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface PresenceRecord {
  id: number;
  etudiantNom: string;
  etudiantNumero: string;
  statut: string;
  modeSaisie: string;
  horodatage: string;
  aJustificatif: boolean;
}

@Injectable({ providedIn: 'root' })
export class PresenceGlobalService {
  private apiUrl = `${environment.apiUrl}/presences`;

  constructor(private http: HttpClient) {}

  getAllPresences(): Observable<PresenceRecord[]> {
    return this.http.get<PresenceRecord[]>(`${this.apiUrl}/global`);
  }

  getPresencesParGroupe(groupe: string): Observable<PresenceRecord[]> {
    return this.http.get<PresenceRecord[]>(`${this.apiUrl}/par-groupe/${groupe}`);
  }
}
