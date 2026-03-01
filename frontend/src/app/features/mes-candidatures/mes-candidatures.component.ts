import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { Candidature, StatutCandidature } from '../../core/models/candidature.model';
import { CandidatureService } from '../../core/services/candidature.service';
import { NotificationService } from '../../shared/services/notification.service';

@Component({
  selector: 'app-mes-candidatures',
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
  ],
  templateUrl: './mes-candidatures.component.html',
  styleUrls: ['./mes-candidatures.component.scss'],
})
export class MesCandidaturesComponent implements OnInit {
  private cdr = inject(ChangeDetectorRef);
  form: FormGroup;
  candidatures: Candidature[] = [];
  displayedColumns = ['sujetTitre', 'rangPreference', 'statut', 'dateCandidature', 'actions'];
  isSubmitting = false;
  isLoading = false;

  readonly StatutCandidature = StatutCandidature;

  constructor(
    private fb: FormBuilder,
    private candidatureService: CandidatureService,
    private notification: NotificationService,
  ) {
    this.form = this.fb.group({
      sujetId: [null, [Validators.required, Validators.min(1)]],
      rangPreference: [null, [Validators.required, Validators.min(1), Validators.max(5)]],
    });
  }

  ngOnInit(): void {
    this.loadCandidatures();
  }

  loadCandidatures(): void {
    this.isLoading = true;
    this.candidatureService.getMyCandidatures().subscribe({
      next: (data) => {
        this.candidatures = data;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.notification.error('Impossible de charger vos candidatures.');
        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
  }

  onSubmit(): void {
    if (this.form.invalid || this.isSubmitting) return;

    this.isSubmitting = true;
    const payload = {
      sujetId: Number(this.form.value.sujetId),
      rangPreference: Number(this.form.value.rangPreference),
    };

    this.candidatureService.create(payload).subscribe({
      next: () => {
        this.notification.success('Candidature soumise avec succès.');
        this.form.reset();
        this.isSubmitting = false;
        this.loadCandidatures();
        this.cdr.markForCheck();
      },
      error: () => {
        this.notification.error('Échec de la soumission. Vérifiez vos données.');
        this.isSubmitting = false;
        this.cdr.markForCheck();
      },
    });
  }

  onDelete(id: number): void {
    if (!window.confirm('Supprimer cette candidature ?')) return;

    this.candidatureService.delete(id).subscribe({
      next: () => {
        this.notification.success('Candidature supprimée.');
        this.loadCandidatures();
        this.cdr.markForCheck();
      },
      error: () => {
        this.notification.error('Impossible de supprimer la candidature.');
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
