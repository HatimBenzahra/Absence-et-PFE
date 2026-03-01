import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Justificatif, JustificatifCreate } from '../models/justificatif.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class JustificatifService {
  private apiUrl = `${environment.apiUrl}/justificatifs`;

  constructor(private http: HttpClient) {}

  submit(justificatif: JustificatifCreate): Observable<Justificatif> {
    return this.http.post<Justificatif>(this.apiUrl, justificatif);
  }

  getMesJustificatifs(): Observable<Justificatif[]> {
    return this.http.get<Justificatif[]>(`${this.apiUrl}/mes-justificatifs`);
  }

  getAValider(): Observable<Justificatif[]> {
    return this.http.get<Justificatif[]>(`${this.apiUrl}/a-valider`);
  }

  getAllJustificatifs(): Observable<Justificatif[]> {
    return this.http.get<Justificatif[]>(`${this.apiUrl}/tous`);
  }

  getAllAValider(): Observable<Justificatif[]> {
    return this.http.get<Justificatif[]>(`${this.apiUrl}/tous/a-valider`);
  }

  valider(id: number, accepter: boolean, commentaire?: string): Observable<Justificatif> {
    const params: any = { accepter };
    if (commentaire) {
      params['commentaire'] = commentaire;
    }
    return this.http.put<Justificatif>(`${this.apiUrl}/${id}/valider`, {}, { params });
  }
}
