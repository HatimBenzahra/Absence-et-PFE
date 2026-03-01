import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, Role } from '../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private apiUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  getAllUtilisateurs(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/utilisateurs`);
  }

  getUtilisateurById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/utilisateurs/${id}`);
  }

  updateRole(id: number, role: Role): Observable<User> {
    const params = new HttpParams().set('role', role);
    return this.http.put<User>(`${this.apiUrl}/utilisateurs/${id}/role`, null, { params });
  }

  deleteUtilisateur(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/utilisateurs/${id}`);
  }

  getSystemStats(): Observable<{ totalUtilisateurs: number; parRole: Record<string, number> }> {
    return this.http.get<any>(`${this.apiUrl}/stats`);
  }
}
