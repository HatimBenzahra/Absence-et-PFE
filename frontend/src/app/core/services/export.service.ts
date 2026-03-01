import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ExportService {
  private apiUrl = `${environment.apiUrl}/statistiques`;

  constructor(private http: HttpClient) {}

  exportCSV(groupe?: string, debut?: string, fin?: string): Observable<Blob> {
    const params: any = {};
    if (debut) params['debut'] = debut;
    if (fin) params['fin'] = fin;
    return this.http.get(`${this.apiUrl}/export/csv`, {
      responseType: 'blob',
      params
    });
  }

  exportPDF(groupe?: string, debut?: string, fin?: string): Observable<Blob> {
    const params: any = {};
    if (debut) params['debut'] = debut;
    if (fin) params['fin'] = fin;
    return this.http.get(`${this.apiUrl}/export/pdf`, {
      responseType: 'blob',
      params
    });
  }
}
