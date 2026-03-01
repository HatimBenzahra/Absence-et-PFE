import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Soutenance, SoutenanceCreate } from '../models/soutenance.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SoutenanceService {
  private apiUrl = `${environment.apiUrl}/soutenances`;

  constructor(private http: HttpClient) {}

  planifier(s: SoutenanceCreate): Observable<Soutenance> {
    return this.http.post<Soutenance>(this.apiUrl, s);
  }

  getAll(): Observable<Soutenance[]> {
    return this.http.get<Soutenance[]>(this.apiUrl);
  }

  getByAffectation(affectationId: number): Observable<Soutenance[]> {
    return this.http.get<Soutenance[]>(`${this.apiUrl}/affectation/${affectationId}`);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
