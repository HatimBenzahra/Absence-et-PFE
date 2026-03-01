import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { PresenceGlobalService, PresenceRecord } from '../../core/services/presence-global.service';
import { NotificationService } from '../../shared/services/notification.service';

@Component({
  selector: 'app-supervision-presences',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatChipsModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
  ],
  templateUrl: './supervision-presences.component.html',
  styleUrl: './supervision-presences.component.scss',
})
export class SupervisionPresencesComponent implements OnInit {
  private cdr = inject(ChangeDetectorRef);
  presences: PresenceRecord[] = [];
  loading = true;
  displayedColumns = ['etudiantNom', 'etudiantNumero', 'statut', 'modeSaisie', 'horodatage', 'aJustificatif'];

  constructor(
    private presenceGlobalService: PresenceGlobalService,
    private notification: NotificationService,
  ) {}

  ngOnInit(): void {
    this.loadPresences();
  }

  loadPresences(): void {
    this.loading = true;
    this.presenceGlobalService.getAllPresences().subscribe({
      next: (data) => {
        this.presences = data;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.notification.error('Impossible de charger les presences globales.');
        this.loading = false;
        this.cdr.markForCheck();
      },
    });
  }

  statutClass(statut: string): string {
    const map: Record<string, string> = {
      PRESENT: 'chip--present',
      ABSENT: 'chip--absent',
      RETARD: 'chip--retard',
      EXCUSE: 'chip--excuse',
    };

    return map[statut] ?? 'chip--default';
  }

  modeLabel(mode: string): string {
    return mode === 'MANUEL' ? 'Manuel' : mode;
  }

  statutLabel(statut: string): string {
    const labels: Record<string, string> = {
      PRESENT: 'Present',
      ABSENT: 'Absent',
      RETARD: 'Retard',
      EXCUSE: 'Excuse',
    };

    return labels[statut] ?? statut;
  }
}
