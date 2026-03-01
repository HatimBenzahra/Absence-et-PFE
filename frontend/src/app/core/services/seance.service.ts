import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Seance, SeanceCreate } from '../models/seance.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SeanceService {
  private apiUrl = `${environment.apiUrl}/seances`;

  constructor(private http: HttpClient) {}

  getMySeances(): Observable<Seance[]> {
    return this.http.get<Seance[]>(`${this.apiUrl}/mes-seances`);
  }

  create(seance: SeanceCreate): Observable<Seance> {
    return this.http.post<Seance>(this.apiUrl, seance);
  }

  generateQrCode(id: number): Observable<{ tokenQR: string }> {
    return this.http.post<{ tokenQR: string }>(`${this.apiUrl}/${id}/qr`, {});
  }

  getSeancesByGroupe(groupe: string): Observable<Seance[]> {
    return this.http.get<Seance[]>(`${this.apiUrl}/groupe/${groupe}`);
  }
}
