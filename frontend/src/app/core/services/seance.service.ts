import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Seance, SeanceCreate } from '../models/seance.model';

@Injectable({ providedIn: 'root' })
export class SeanceService {
  private apiUrl = 'http://localhost:8080/api/seances';

  constructor(private http: HttpClient) {}

  getMySeances(): Observable<Seance[]> {
    return this.http.get<Seance[]>(`${this.apiUrl}/me`);
  }

  create(seance: SeanceCreate): Observable<Seance> {
    return this.http.post<Seance>(this.apiUrl, seance);
  }

  generateQrCode(id: number): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/${id}/qrcode`, {});
  }
}
