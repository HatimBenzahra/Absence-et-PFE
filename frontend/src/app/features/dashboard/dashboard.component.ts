import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../shared/material.module';
import { AuthService } from '../../core/services/auth.service';
import { User, Role } from '../../core/models/user.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  template: `
    <div class="dashboard-container">
      <h1>Bienvenue, {{ user?.prenom }} {{ user?.nom }}</h1>
      <p>Rôle: {{ user?.role }}</p>

      <div class="dashboard-cards">
        <mat-card *ngIf="isEtudiant()">
          <mat-card-header>
            <mat-card-title>Mon PFE</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Accédez à votre espace PFE pour voir vos candidatures et votre affectation.</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button color="primary" routerLink="/projets/mon-pfe">Voir mon PFE</button>
          </mat-card-actions>
        </mat-card>

        <mat-card *ngIf="isEtudiant()">
          <mat-card-header>
            <mat-card-title>Mes Présences</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Consultez votre historique de présence et scannez les QR codes.</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button color="primary" routerLink="/presences/pointage">Scanner QR</button>
          </mat-card-actions>
        </mat-card>

        <mat-card *ngIf="isEnseignant()">
          <mat-card-header>
            <mat-card-title>Mes Séances</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Gérez vos séances et générez les QR codes pour l'appel.</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button color="primary" routerLink="/presences/mes-seances">Voir mes séances</button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 20px;
    }
    .dashboard-cards {
      display: flex;
      gap: 20px;
      flex-wrap: wrap;
      margin-top: 20px;
    }
    mat-card {
      width: 300px;
    }
  `]
})
export class DashboardComponent implements OnInit {
  user: User | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
  }

  isEtudiant(): boolean {
    return this.authService.hasRole(Role.ETUDIANT);
  }

  isEnseignant(): boolean {
    return this.authService.hasRole(Role.ENSEIGNANT);
  }
}
