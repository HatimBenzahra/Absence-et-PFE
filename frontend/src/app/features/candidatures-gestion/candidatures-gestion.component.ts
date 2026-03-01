import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { Candidature, StatutCandidature } from '../../core/models/candidature.model';
import { Sujet } from '../../core/models/sujet.model';
import { CandidatureService } from '../../core/services/candidature.service';
import { SujetService } from '../../core/services/sujet.service';
import { NotificationService } from '../../shared/services/notification.service';

@Component({
  selector: 'app-candidatures-gestion',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './candidatures-gestion.component.html',
  styleUrls: ['./candidatures-gestion.component.scss'],
})
export class CandidaturesGestionComponent implements OnInit {
  private cdr = inject(ChangeDetectorRef);
  sujets: Sujet[] = [];
  candidatures: Candidature[] = [];
  selectedSujetId: number | null = null;

  isLoadingSujets = false;
  isLoadingCandidatures = false;
  hasSelected = false;

  displayedColumns = ['sujetTitre', 'rangPreference', 'statut', 'dateCandidature'];

  readonly StatutCandidature = StatutCandidature;

  constructor(
    private sujetService: SujetService,
    private candidatureService: CandidatureService,
    private notification: NotificationService,
  ) {}

  ngOnInit(): void {
    this.loadSujets();
  }

  loadSujets(): void {
    this.isLoadingSujets = true;
    this.sujetService.getAll().subscribe({
      next: (data) => {
        this.sujets = data;
        this.isLoadingSujets = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.notification.error('Impossible de charger la liste des sujets.');
        this.isLoadingSujets = false;
        this.cdr.markForCheck();
      },
    });
  }

  onSujetChange(sujetId: number): void {
    this.selectedSujetId = sujetId;
    this.hasSelected = true;
    this.candidatures = [];
    this.isLoadingCandidatures = true;

    this.candidatureService.getCandidaturesBySujet(sujetId).subscribe({
      next: (data) => {
        this.candidatures = data;
        this.isLoadingCandidatures = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.notification.error('Impossible de charger les candidatures pour ce sujet.');
        this.isLoadingCandidatures = false;
        this.cdr.markForCheck();
      },
    });
  }

  statutLabel(statut: StatutCandidature): string {
    const labels: Record<StatutCandidature, string> = {
      [StatutCandidature.EN_ATTENTE]: 'En attente',
      [StatutCandidature.ACCEPTEE]: 'Acceptée',
      [StatutCandidature.REFUSEE]: 'Refusée',
    };
    return labels[statut] ?? statut;
  }

  statutClass(statut: StatutCandidature): string {
    const map: Record<StatutCandidature, string> = {
      [StatutCandidature.EN_ATTENTE]: 'chip--pending',
      [StatutCandidature.ACCEPTEE]: 'chip--accepted',
      [StatutCandidature.REFUSEE]: 'chip--refused',
    };
    return map[statut] ?? '';
  }
}
