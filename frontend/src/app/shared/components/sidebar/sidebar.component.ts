import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../material.module';
import { AuthService } from '../../../core/services/auth.service';
import { Role } from '../../../core/models/user.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule],
  template: `
    <mat-nav-list>
      <a mat-list-item routerLink="/dashboard" routerLinkActive="active">
        <mat-icon matListItemIcon>dashboard</mat-icon>
        <span matListItemTitle>Tableau de bord</span>
      </a>

      <div mat-subheader>Projets PFE</div>
      <a mat-list-item routerLink="/projets/sujets" routerLinkActive="active">
        <mat-icon matListItemIcon>list</mat-icon>
        <span matListItemTitle>Liste des sujets</span>
      </a>
      <a mat-list-item *ngIf="isEtudiant()" routerLink="/projets/mes-candidatures" routerLinkActive="active">
        <mat-icon matListItemIcon>assignment</mat-icon>
        <span matListItemTitle>Mes candidatures</span>
      </a>
      <a mat-list-item *ngIf="isEtudiant()" routerLink="/projets/mon-pfe" routerLinkActive="active">
        <mat-icon matListItemIcon>work</mat-icon>
        <span matListItemTitle>Mon PFE</span>
      </a>

      <div mat-subheader>Présences</div>
      <a mat-list-item *ngIf="isEnseignant()" routerLink="/presences/mes-seances" routerLinkActive="active">
        <mat-icon matListItemIcon>calendar_today</mat-icon>
        <span matListItemTitle>Mes séances</span>
      </a>
      <a mat-list-item *ngIf="isEtudiant()" routerLink="/presences/pointage" routerLinkActive="active">
        <mat-icon matListItemIcon>qr_code_scanner</mat-icon>
        <span matListItemTitle>Scanner QR</span>
      </a>
      <a mat-list-item *ngIf="isEtudiant()" routerLink="/presences/historique" routerLinkActive="active">
        <mat-icon matListItemIcon>history</mat-icon>
        <span matListItemTitle>Historique</span>
      </a>
      <a mat-list-item *ngIf="isEtudiant()" routerLink="/presences/justificatifs" routerLinkActive="active">
        <mat-icon matListItemIcon>upload_file</mat-icon>
        <span matListItemTitle>Justificatifs</span>
      </a>
    </mat-nav-list>
  `,
  styles: [`
    .active {
      background-color: rgba(0, 0, 0, 0.05);
    }
  `]
})
export class SidebarComponent {
  constructor(private authService: AuthService) {}

  isEtudiant(): boolean {
    return this.authService.hasRole(Role.ETUDIANT);
  }

  isEnseignant(): boolean {
    return this.authService.hasRole(Role.ENSEIGNANT);
  }
}
