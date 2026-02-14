import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="dashboard">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Bienvenue, {{ authService.getCurrentUser()?.prenom }} !</mat-card-title>
          <mat-card-subtitle>Vous êtes connecté en tant que {{ authService.getCurrentUser()?.role }}</mat-card-subtitle>
        </mat-card-header>
        <mat-card-actions>
          <button mat-stroked-button color="warn" (click)="logout()">
            <mat-icon>logout</mat-icon>
            Se déconnecter
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .dashboard {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 24px;
      background: #fafafa;
    }
    mat-card { max-width: 500px; padding: 32px; border-radius: 16px; }
  `],
})
export class DashboardComponent {
  constructor(public authService: AuthService, private router: Router) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
