import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { Affectation, StatutAffectation } from '../../core/models/affectation.model';
import { AffectationManuelleRequest, AffectationService } from '../../core/services/affectation.service';
import { NotificationService } from '../../shared/services/notification.service';

@Component({
  selector: 'app-affectations',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './affectations.component.html',
  styleUrls: ['./affectations.component.scss'],
})
export class AffectationsComponent implements OnInit {
  private cdr = inject(ChangeDetectorRef);
  form: FormGroup;
  affectations: Affectation[] = [];
  displayedColumns = ['etudiantNom', 'sujetTitre', 'encadrantNom', 'statut', 'dateAffectation'];
  isSubmitting = false;
  isAutoRunning = false;
  isLoading = false;

  readonly StatutAffectation = StatutAffectation;

  constructor(
    private fb: FormBuilder,
    private affectationService: AffectationService,
    private notification: NotificationService,
  ) {
    this.form = this.fb.group({
      etudiantId: [null, [Validators.required, Validators.min(1)]],
      sujetId: [null, [Validators.required, Validators.min(1)]],
      encadrantId: [null, [Validators.min(1)]],
    });
  }

  ngOnInit(): void {
    this.loadAffectations();
  }

  loadAffectations(): void {
    this.isLoading = true;
    this.affectationService.getMesEncadrements().subscribe({
      next: (data) => {
        this.affectations = data;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.notification.error('Impossible de charger les affectations.');
        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
  }

  onSubmit(): void {
    if (this.form.invalid || this.isSubmitting) return;

    this.isSubmitting = true;
    const { etudiantId, sujetId, encadrantId } = this.form.value;

    const payload: AffectationManuelleRequest = {
      etudiantId: Number(etudiantId),
      sujetId: Number(sujetId),
    };

    if (encadrantId) {
      payload.encadrantId = Number(encadrantId);
    }

    this.affectationService.affecterManuel(payload).subscribe({
      next: () => {
        this.notification.success('Affectation manuelle effectuée avec succès.');
        this.form.reset();
        this.isSubmitting = false;
        this.loadAffectations();
        this.cdr.markForCheck();
      },
      error: () => {
        this.notification.error("Échec de l'affectation manuelle. Vérifiez vos données.");
        this.isSubmitting = false;
        this.cdr.markForCheck();
      },
    });
  }

  onAutoAffectation(): void {
    if (this.isAutoRunning) return;

    this.isAutoRunning = true;
    this.affectationService.affecterAuto().subscribe({
      next: (results) => {
        this.notification.success(
          `Affectation automatique effectuée — ${results.length} affectation(s) créée(s).`,
        );
        this.isAutoRunning = false;
        this.loadAffectations();
        this.cdr.markForCheck();
      },
      error: () => {
        this.notification.error("Échec de l'affectation automatique.");
        this.isAutoRunning = false;
        this.cdr.markForCheck();
      },
    });
  }

  statutLabel(statut: StatutAffectation): string {
    const labels: Record<StatutAffectation, string> = {
      [StatutAffectation.EN_COURS]: 'En cours',
      [StatutAffectation.TERMINE]: 'Terminé',
      [StatutAffectation.ABANDONNE]: 'Abandonné',
    };
    return labels[statut] ?? statut;
  }

  statutClass(statut: StatutAffectation): string {
    const map: Record<StatutAffectation, string> = {
      [StatutAffectation.EN_COURS]: 'chip--en-cours',
      [StatutAffectation.TERMINE]: 'chip--termine',
      [StatutAffectation.ABANDONNE]: 'chip--abandonne',
    };
    return map[statut] ?? '';
  }

  getInitials(name: string): string {
    return (name || '?').substring(0, 2).toUpperCase();
  }
}
