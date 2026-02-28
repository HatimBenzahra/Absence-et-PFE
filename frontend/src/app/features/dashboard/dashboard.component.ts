import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Role } from '../../core/models/user.model';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  template: `
    <section class="hero-card">
      <p class="eyebrow">ISTY</p>
      <h2>Bienvenue, {{ authService.getCurrentUser()?.prenom }} {{ authService.getCurrentUser()?.nom }}</h2>
      <p>
        Vous etes connecte dans l'espace {{ roleLabel }}. Le menu lateral adapte automatiquement les
        pages disponibles selon votre role.
      </p>
    </section>

    <section class="stats-grid">
      <mat-card class="stat-card" *ngFor="let item of roleHighlights">
        <mat-icon>{{ item.icon }}</mat-icon>
        <div>
          <p class="label">{{ item.label }}</p>
          <p class="value">{{ item.value }}</p>
        </div>
      </mat-card>
    </section>

    <section class="quick-list">
      <h3>Raccourcis de votre role</h3>
      <div class="chips">
        <span *ngFor="let item of quickActions">{{ item }}</span>
      </div>
    </section>
  `,
  styles: [`
    .hero-card {
      background:
        radial-gradient(circle at top right, rgba(0, 151, 196, 0.2), transparent 45%),
        linear-gradient(135deg, #4a1233 0%, #6d1d4a 45%, #8b2960 100%);
      border-radius: 20px;
      color: #fff;
      padding: 28px;
      margin-bottom: 20px;

      .eyebrow {
        text-transform: uppercase;
        letter-spacing: 1px;
        font-size: 12px;
        font-weight: 700;
        margin-bottom: 8px;
        color: rgba(255, 255, 255, 0.85);
      }

      h2 {
        font-size: 28px;
        margin-bottom: 10px;
      }

      p {
        line-height: 1.6;
        max-width: 720px;
        color: rgba(255, 255, 255, 0.9);
      }
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
      gap: 14px;
      margin-bottom: 20px;
    }

    .stat-card {
      border: 1px solid #e2e8f0;
      border-radius: 14px;
      box-shadow: none;
      display: flex;
      gap: 12px;
      align-items: center;
      padding: 18px;

      mat-icon {
        color: #0097c4;
        width: 36px;
        height: 36px;
        font-size: 36px;
      }

      .label {
        color: #64748b;
        font-size: 12px;
      }

      .value {
        color: #1e293b;
        font-size: 20px;
        font-weight: 700;
      }
    }

    .quick-list {
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 14px;
      padding: 20px;

      h3 {
        color: #1e293b;
        margin-bottom: 12px;
      }
    }

    .chips {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;

      span {
        padding: 8px 12px;
        border-radius: 999px;
        background: rgba(0, 151, 196, 0.12);
        color: #007a9e;
        font-size: 13px;
        font-weight: 600;
      }
    }
  `],
})
export class DashboardComponent {
  constructor(public authService: AuthService) {}

  get roleLabel(): string {
    const labels: Record<Role, string> = {
      [Role.ETUDIANT]: 'Etudiant',
      [Role.ENSEIGNANT]: 'Enseignant',
      [Role.RESPONSABLE_PFE]: 'Responsable PFE',
      [Role.SECRETARIAT]: 'Secretariat',
      [Role.ADMIN]: 'Administrateur',
    };

    const role = this.authService.getCurrentUser()?.role;
    return role ? labels[role] : 'Utilisateur';
  }

  get roleHighlights(): Array<{ icon: string; label: string; value: string }> {
    const role = this.authService.getCurrentUser()?.role;

    if (role === Role.ETUDIANT) {
      return [
        { icon: 'fact_check', label: 'Presences', value: '--' },
        { icon: 'event', label: 'Seances', value: '--' },
        { icon: 'description', label: 'Justificatifs', value: '--' },
      ];
    }

    if (role === Role.ENSEIGNANT) {
      return [
        { icon: 'event_note', label: 'Seances a venir', value: '--' },
        { icon: 'how_to_reg', label: 'Presences a valider', value: '--' },
        { icon: 'menu_book', label: 'Sujets actifs', value: '--' },
      ];
    }

    if (role === Role.RESPONSABLE_PFE) {
      return [
        { icon: 'task_alt', label: 'Sujets en attente', value: '--' },
        { icon: 'groups', label: 'Candidatures', value: '--' },
        { icon: 'assignment', label: 'Affectations', value: '--' },
      ];
    }

    return [
      { icon: 'query_stats', label: 'Activite', value: '--' },
      { icon: 'download', label: 'Exports', value: '--' },
      { icon: 'admin_panel_settings', label: 'Administration', value: '--' },
    ];
  }

  get quickActions(): string[] {
    const role = this.authService.getCurrentUser()?.role;

    if (role === Role.ETUDIANT) {
      return ['Scanner QR', 'Consulter presences', 'Suivre candidatures'];
    }

    if (role === Role.ENSEIGNANT) {
      return ['Creer seance', 'Saisir presences', 'Suivre sujets'];
    }

    if (role === Role.RESPONSABLE_PFE) {
      return ['Valider sujets', 'Affecter etudiants', 'Suivre statistiques'];
    }

    return ['Consulter statistiques', 'Exporter donnees', 'Superviser plateforme'];
  }
}
