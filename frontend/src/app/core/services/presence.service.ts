import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Presence, PointageRequest } from '../models/presence.model';

@Injectable({ providedIn: 'root' })
export class PresenceService {
  private apiUrl = 'http://localhost:8080/api/presences';

  constructor(private http: HttpClient) {}

  getMyPresences(): Observable<Presence[]> {
    return this.http.get<Presence[]>(`${this.apiUrl}/me`);
  }

  pointer(request: PointageRequest): Observable<Presence> {
    return this.http.post<Presence>(`${this.apiUrl}/pointer`, request);
  }

  justifier(id: number, file: File): Observable<Presence> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<Presence>(`${this.apiUrl}/${id}/justifier`, formData);
  }
}
