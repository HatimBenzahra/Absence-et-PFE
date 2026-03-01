import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

import { PresenceService } from '../../core/services/presence.service';
import { NotificationService } from '../../shared/services/notification.service';
import { Presence, StatutPresence } from '../../core/models/presence.model';

@Component({
  selector: 'app-mes-presences',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    MatTableModule,
    MatChipsModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
  ],
  templateUrl: './mes-presences.component.html',
  styleUrl: './mes-presences.component.scss',
})
export class MesPresencesComponent implements OnInit {
  private cdr = inject(ChangeDetectorRef);
  presences: Presence[] = [];
  loading = true;
  displayedColumns: string[] = ['horodatage', 'statut', 'modeSaisie'];
  readonly StatutPresence = StatutPresence;

  constructor(
    private presenceService: PresenceService,
    private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    this.presenceService.getMyPresences().subscribe({
      next: (data) => {
        this.presences = data;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.notificationService.error('Erreur lors du chargement des présences');
        this.loading = false;
        this.cdr.markForCheck();
      },
    });
  }

  getChipColor(statut: StatutPresence): string {
    switch (statut) {
      case StatutPresence.PRESENT:
        return '#4caf50';
      case StatutPresence.ABSENT:
        return '#f44336';
      case StatutPresence.RETARD:
        return '#ff9800';
      case StatutPresence.EXCUSE:
        return '#2196f3';
      default:
        return '#9e9e9e';
    }
  }
}
