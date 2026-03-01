import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Livrable, LivrableCreate } from '../models/livrable.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class LivrableService {
  private apiUrl = `${environment.apiUrl}/livrables`;

  constructor(private http: HttpClient) {}

  getLivrablesByAffectation(affectationId: number): Observable<Livrable[]> {
    return this.http.get<Livrable[]>(`${this.apiUrl}/affectation/${affectationId}`);
  }

  submit(affectationId: number, livrable: LivrableCreate): Observable<Livrable> {
    return this.http.post<Livrable>(`${this.apiUrl}/affectation/${affectationId}`, livrable);
  }
}
