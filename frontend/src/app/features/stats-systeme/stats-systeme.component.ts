import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { AdminService } from '../../core/services/admin.service';
import { NotificationService } from '../../shared/services/notification.service';

interface RoleStat {
  role: string;
  label: string;
  icon: string;
  count: number;
  colorClass: string;
}

@Component({
  selector: 'app-stats-systeme',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
  ],
  templateUrl: './stats-systeme.component.html',
  styleUrl: './stats-systeme.component.scss',
})
export class StatsSystemeComponent implements OnInit {
  private cdr = inject(ChangeDetectorRef);
  totalUtilisateurs = 0;
  roleStats: RoleStat[] = [];
  loading = true;

  constructor(
    private adminService: AdminService,
    private notification: NotificationService,
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.loading = true;
    this.adminService.getSystemStats().subscribe({
      next: (data) => {
        this.totalUtilisateurs = data.totalUtilisateurs;
        this.roleStats = this.buildRoleStats(data.parRole);
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.notification.error('Impossible de charger les statistiques système.');
        this.loading = false;
        this.cdr.markForCheck();
      },
    });
  }

  private buildRoleStats(parRole: Record<string, number>): RoleStat[] {
    const config: { role: string; label: string; icon: string; colorClass: string }[] = [
      { role: 'ETUDIANT', label: 'Étudiants', icon: 'school', colorClass: 'stat-card--etudiant' },
      { role: 'ENSEIGNANT', label: 'Enseignants', icon: 'person', colorClass: 'stat-card--enseignant' },
      { role: 'RESPONSABLE_PFE', label: 'Responsables PFE', icon: 'supervisor_account', colorClass: 'stat-card--responsable' },
      { role: 'SECRETARIAT', label: 'Secrétariat', icon: 'admin_panel_settings', colorClass: 'stat-card--secretariat' },
      { role: 'ADMIN', label: 'Administrateurs', icon: 'shield_person', colorClass: 'stat-card--admin' },
    ];

    return config.map((c) => ({
      ...c,
      count: parRole[c.role] ?? 0,
    }));
  }
}
