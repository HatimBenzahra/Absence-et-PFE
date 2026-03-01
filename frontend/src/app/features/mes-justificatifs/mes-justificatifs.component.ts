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
import { MatSelectModule } from '@angular/material/select';
import { PresenceService } from '../../core/services/presence.service';
import { Presence } from '../../core/models/presence.model';
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
    MatSelectModule,
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

  absencesRetards: Presence[] = [];
  loadingPresences = false;

  loadingList = false;
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private justificatifService: JustificatifService,
    private presenceService: PresenceService,
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
    this.loadAbsences();
  }

  loadAbsences(): void {
    this.loadingPresences = true;
    this.presenceService.getMyPresences().subscribe({
      next: (data) => {
        this.absencesRetards = data.filter(
          (p) => (p.statut === 'ABSENT' || p.statut === 'RETARD') && !p.aJustificatif
        );
        this.loadingPresences = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.loadingPresences = false;
        this.cdr.markForCheck();
      },
    });
  }

  presenceLabel(p: Presence): string {
    const statut = p.statut === 'ABSENT' ? 'Absent' : 'Retard';
    const matiere = p.seanceMatiere || 'Séance';
    const date = p.seanceDate
      ? new Date(p.seanceDate).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
      : new Date(p.horodatage).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    return `${matiere} — ${date} (${statut})`;
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
        this.loadAbsences();
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
