import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SeanceService } from '../../core/services/seance.service';
import { NotificationService } from '../../shared/services/notification.service';
import { EnseignantOption, Seance, TypeSeance } from '../../core/models/seance.model';

@Component({
  selector: 'app-consultation-enseignants',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatFormFieldModule,
    MatSelectModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './consultation-enseignants.component.html',
  styleUrl: './consultation-enseignants.component.scss',
})
export class ConsultationEnseignantsComponent implements OnInit {
  private cdr = inject(ChangeDetectorRef);

  enseignants: EnseignantOption[] = [];
  seances: Seance[] = [];
  selectedEnseignantId: number | 'all' = 'all';
  displayedColumns = ['matiere', 'typeSeance', 'dateHeureDebut', 'dateHeureFin', 'groupe', 'salle'];

  loadingEnseignants = false;
  loadingSeances = false;

  constructor(
    private seanceService: SeanceService,
    private notify: NotificationService,
  ) {}

  ngOnInit(): void {
    this.loadEnseignants();
    this.loadAllSeances();
  }

  loadEnseignants(): void {
    this.loadingEnseignants = true;
    this.seanceService.getEnseignants().subscribe({
      next: (data) => {
        this.enseignants = data as EnseignantOption[];
        this.loadingEnseignants = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.notify.error('Erreur lors du chargement des enseignants.');
        this.loadingEnseignants = false;
        this.cdr.markForCheck();
      },
    });
  }

  onSelectionChange(value: number | 'all'): void {
    this.selectedEnseignantId = value;
    if (value === 'all') {
      this.loadAllSeances();
      return;
    }

    this.loadSeancesByEnseignant(value);
  }

  loadAllSeances(): void {
    this.loadingSeances = true;
    this.seanceService.getAllSeances().subscribe({
      next: (data) => {
        this.seances = data;
        this.loadingSeances = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.notify.error('Erreur lors du chargement des séances.');
        this.loadingSeances = false;
        this.cdr.markForCheck();
      },
    });
  }

  loadSeancesByEnseignant(enseignantId: number): void {
    this.loadingSeances = true;
    this.seanceService.getSeancesByEnseignant(enseignantId).subscribe({
      next: (data) => {
        this.seances = data;
        this.loadingSeances = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.notify.error('Erreur lors du chargement des séances de cet enseignant.');
        this.loadingSeances = false;
        this.cdr.markForCheck();
      },
    });
  }

  typeSeanceLabel(type: TypeSeance): string {
    const labels: Record<TypeSeance, string> = {
      [TypeSeance.CM]: 'Cours magistral',
      [TypeSeance.TD]: 'TD',
      [TypeSeance.TP]: 'TP',
      [TypeSeance.EXAMEN]: 'Examen',
      [TypeSeance.SOUTENANCE]: 'Soutenance',
    };

    return labels[type] ?? type;
  }

  enseignantLabel(enseignant: EnseignantOption): string {
    return `${enseignant.prenom} ${enseignant.nom}`;
  }
}
