import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AffectationService } from '../../core/services/affectation.service';
import { LivrableService } from '../../core/services/livrable.service';
import { NotificationService } from '../../shared/services/notification.service';
import { Affectation, StatutAffectation } from '../../core/models/affectation.model';
import { Livrable, TypeLivrable } from '../../core/models/livrable.model';

@Component({
  selector: 'app-mon-pfe',
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
  templateUrl: './mon-pfe.component.html',
  styleUrls: ['./mon-pfe.component.scss'],
})
export class MonPfeComponent implements OnInit {
  private cdr = inject(ChangeDetectorRef);
  affectation: Affectation | null = null;
  livrables: Livrable[] = [];
  livrableForm: FormGroup;

  loadingAffectation = true;
  loadingLivrables = false;
  submitting = false;

  displayedColumns = ['type', 'titre', 'urlFichier', 'dateDepot'];

  StatutAffectation = StatutAffectation;
  TypeLivrable = TypeLivrable;

  typeLivrableOptions = [
    { value: TypeLivrable.RAPPORT_INTERMEDIAIRE, label: 'Rapport intermédiaire' },
    { value: TypeLivrable.RAPPORT_FINAL, label: 'Rapport final' },
    { value: TypeLivrable.CODE_SOURCE, label: 'Code source' },
    { value: TypeLivrable.PRESENTATION, label: 'Présentation' },
    { value: TypeLivrable.AUTRE, label: 'Autre' },
  ];

  constructor(
    private fb: FormBuilder,
    private affectationService: AffectationService,
    private livrableService: LivrableService,
    private notify: NotificationService
  ) {
    this.livrableForm = this.fb.group({
      type: [null, Validators.required],
      titre: [''],
      urlFichier: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadAffectation();
  }

  loadAffectation(): void {
    this.loadingAffectation = true;
    this.affectationService.getMonPFE().subscribe({
      next: (data) => {
        this.affectation = data;
        this.loadingAffectation = false;
        this.loadLivrables(data.id);
        this.cdr.markForCheck();
      },
      error: () => {
        this.affectation = null;
        this.loadingAffectation = false;
        this.cdr.markForCheck();
      },
    });
  }

  loadLivrables(affectationId: number): void {
    this.loadingLivrables = true;
    this.livrableService.getLivrablesByAffectation(affectationId).subscribe({
      next: (data) => {
        this.livrables = data;
        this.loadingLivrables = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.notify.error('Erreur lors du chargement des livrables.');
        this.loadingLivrables = false;
        this.cdr.markForCheck();
      },
    });
  }

  onSubmit(): void {
    if (this.livrableForm.invalid || !this.affectation) return;

    this.submitting = true;
    const raw = this.livrableForm.value;
    const payload = {
      type: raw.type,
      urlFichier: raw.urlFichier,
      ...(raw.titre ? { titre: raw.titre } : {}),
    };

    this.livrableService.submit(this.affectation.id, payload).subscribe({
      next: () => {
        this.notify.success('Livrable soumis avec succès !');
        this.livrableForm.reset();
        this.submitting = false;
        this.loadLivrables(this.affectation!.id);
        this.cdr.markForCheck();
      },
      error: () => {
        this.notify.error('Erreur lors de la soumission du livrable.');
        this.submitting = false;
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
    const classes: Record<StatutAffectation, string> = {
      [StatutAffectation.EN_COURS]: 'chip--blue',
      [StatutAffectation.TERMINE]: 'chip--green',
      [StatutAffectation.ABANDONNE]: 'chip--red',
    };
    return classes[statut] ?? '';
  }

  typeLivrableLabel(type: TypeLivrable): string {
    const option = this.typeLivrableOptions.find((o) => o.value === type);
    return option?.label ?? type;
  }

  formatDate(isoString: string): string {
    return new Date(isoString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  }
}
