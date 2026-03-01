import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { JustificatifService } from '../../core/services/justificatif.service';
import { NotificationService } from '../../shared/services/notification.service';
import { Justificatif, StatutJustificatif } from '../../core/models/justificatif.model';

@Component({
  selector: 'app-mes-justificatifs',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatTableModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './mes-justificatifs.component.html',
  styleUrl: './mes-justificatifs.component.scss',
})
export class MesJustificatifsComponent implements OnInit {
  private cdr = inject(ChangeDetectorRef);
  submitForm: FormGroup;
  justificatifs: Justificatif[] = [];
  displayedColumns = ['motif', 'statut', 'dateDepot', 'commentaireValidation'];
  StatutJustificatif = StatutJustificatif;

  loadingList = false;
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private justificatifService: JustificatifService,
    private notify: NotificationService
  ) {
    this.submitForm = this.fb.group({
      presenceId: [null, [Validators.required]],
      motif: ['', [Validators.required]],
      urlFichier: [''],
    });
  }

  ngOnInit(): void {
    this.loadJustificatifs();
  }

  loadJustificatifs(): void {
    this.loadingList = true;
    this.justificatifService.getMesJustificatifs().subscribe({
      next: (data) => {
        this.justificatifs = data;
        this.loadingList = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.notify.error('Erreur lors du chargement des justificatifs.');
        this.loadingList = false;
        this.cdr.markForCheck();
      },
    });
  }

  onSubmit(): void {
    if (this.submitForm.invalid) return;

    this.submitting = true;
    const raw = this.submitForm.value;
    const payload = {
      presenceId: Number(raw.presenceId),
      motif: raw.motif,
      ...(raw.urlFichier ? { urlFichier: raw.urlFichier } : {}),
    };

    this.justificatifService.submit(payload).subscribe({
      next: () => {
        this.notify.success('Justificatif soumis avec succès !');
        this.submitForm.reset();
        this.submitting = false;
        this.loadJustificatifs();
        this.cdr.markForCheck();
      },
      error: () => {
        this.notify.error('Erreur lors de la soumission du justificatif.');
        this.submitting = false;
        this.cdr.markForCheck();
      },
    });
  }

  statutLabel(statut: StatutJustificatif): string {
    const labels: Record<StatutJustificatif, string> = {
      [StatutJustificatif.EN_ATTENTE]: 'En attente',
      [StatutJustificatif.ACCEPTE]: 'Accepté',
      [StatutJustificatif.REFUSE]: 'Refusé',
    };
    return labels[statut] ?? statut;
  }

  statutClass(statut: StatutJustificatif): string {
    const classes: Record<StatutJustificatif, string> = {
      [StatutJustificatif.EN_ATTENTE]: 'chip--pending',
      [StatutJustificatif.ACCEPTE]: 'chip--accepted',
      [StatutJustificatif.REFUSE]: 'chip--refused',
    };
    return classes[statut] ?? '';
  }
}
