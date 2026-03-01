import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Presence } from '../models/presence.model';
import { environment } from '../../../environments/environment';

export interface PointageQRRequest {
  tokenQR: string;
}

export interface PointageManuelRequest {
  etudiantId: number;
  statut: string;
}

@Injectable({ providedIn: 'root' })
export class PresenceService {
  private apiUrl = `${environment.apiUrl}/presences`;

  constructor(private http: HttpClient) {}

  getMyPresences(): Observable<Presence[]> {
    return this.http.get<Presence[]>(`${this.apiUrl}/mes-presences`);
  }

  pointer(request: PointageQRRequest): Observable<Presence> {
    return this.http.post<Presence>(`${this.apiUrl}/pointer`, request);
  }

  getPresencesBySeance(seanceId: number): Observable<Presence[]> {
    return this.http.get<Presence[]>(`${this.apiUrl}/seance/${seanceId}`);
  }

  saisirManuel(seanceId: number, presences: PointageManuelRequest[]): Observable<Presence[]> {
    return this.http.post<Presence[]>(`${this.apiUrl}/seance/${seanceId}/manuel`, presences);
  }
}
