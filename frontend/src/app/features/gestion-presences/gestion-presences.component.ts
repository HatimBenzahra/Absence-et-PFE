import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { SeanceService } from '../../core/services/seance.service';
import { PresenceService, PointageManuelRequest } from '../../core/services/presence.service';
import { NotificationService } from '../../shared/services/notification.service';
import { Seance } from '../../core/models/seance.model';
import { Presence } from '../../core/models/presence.model';

@Component({
  selector: 'app-gestion-presences',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatTableModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './gestion-presences.component.html',
  styleUrls: ['./gestion-presences.component.scss'],
})
export class GestionPresencesComponent implements OnInit {
  private cdr = inject(ChangeDetectorRef);
  seances: Seance[] = [];
  selectedSeanceId: number | null = null;
  presences: Presence[] = [];
  editedStatuts = new Map<number, string>();

  loadingSeances = false;
  loadingPresences = false;
  saving = false;

  displayedColumns = ['etudiantNom', 'etudiantNumero', 'statut', 'modeSaisie'];

  statutOptions = [
    { value: 'PRESENT', label: 'Présent' },
    { value: 'ABSENT', label: 'Absent' },
    { value: 'RETARD', label: 'En retard' },
  ];

  constructor(
    private seanceService: SeanceService,
    private presenceService: PresenceService,
    private notification: NotificationService,
  ) {}

  ngOnInit(): void {
    this.loadSeances();
  }

  loadSeances(): void {
    this.loadingSeances = true;
    this.seanceService.getMySeances().subscribe({
      next: (data) => {
        this.seances = data;
        this.loadingSeances = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.notification.error('Erreur lors du chargement des séances');
        this.loadingSeances = false;
        this.cdr.markForCheck();
      },
    });
  }

  onSeanceChange(seanceId: number): void {
    this.selectedSeanceId = seanceId;
    this.presences = [];
    this.editedStatuts.clear();
    this.loadPresences(seanceId);
  }

  loadPresences(seanceId: number): void {
    this.loadingPresences = true;
    this.presenceService.getPresencesBySeance(seanceId).subscribe({
      next: (data) => {
        this.presences = data;
        data.forEach((p) => this.editedStatuts.set(p.id, p.statut));
        this.loadingPresences = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.notification.error('Erreur lors du chargement des présences');
        this.loadingPresences = false;
        this.cdr.markForCheck();
      },
    });
  }

  getStatut(presenceId: number): string {
    return this.editedStatuts.get(presenceId) ?? '';
  }

  setStatut(presenceId: number, statut: string): void {
    this.editedStatuts.set(presenceId, statut);
  }

  enregistrer(): void {
    if (!this.selectedSeanceId || this.saving) return;

    const payload: PointageManuelRequest[] = this.presences.map((p) => ({
      etudiantId: p.id,
      statut: this.editedStatuts.get(p.id) ?? p.statut,
    }));

    this.saving = true;
    this.presenceService.saisirManuel(this.selectedSeanceId, payload).subscribe({
      next: () => {
        this.notification.success('Présences enregistrées avec succès !');
        this.saving = false;
        this.cdr.markForCheck();
      },
      error: (err: { error?: { message?: string } }) => {
        this.notification.error(err.error?.message || "Erreur lors de l'enregistrement");
        this.saving = false;
        this.cdr.markForCheck();
      },
    });
  }

  seanceLabel(seance: Seance): string {
    const date = new Date(seance.dateHeureDebut).toLocaleDateString('fr-FR', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
    });
    const time = new Date(seance.dateHeureDebut).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
    const groupe = seance.groupe ? ` · ${seance.groupe}` : '';
    return `${seance.matiere} — ${seance.typeSeance}${groupe} · ${date} ${time}`;
  }

  statutLabel(statut: string): string {
    const labels: Record<string, string> = {
      PRESENT: 'Présent',
      ABSENT: 'Absent',
      RETARD: 'En retard',
      EXCUSE: 'Excusé',
    };
    return labels[statut] ?? statut;
  }
}
