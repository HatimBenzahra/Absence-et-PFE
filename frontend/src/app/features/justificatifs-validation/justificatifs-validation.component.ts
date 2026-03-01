import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  selector: 'app-justificatifs-validation',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatTableModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './justificatifs-validation.component.html',
  styleUrl: './justificatifs-validation.component.scss',
})
export class JustificatifsValidationComponent implements OnInit {
  private cdr = inject(ChangeDetectorRef);
  justificatifs: Justificatif[] = [];
  displayedColumns = ['motif', 'urlFichier', 'dateDepot', 'statut', 'commentaire', 'actions'];
  StatutJustificatif = StatutJustificatif;

  comments = new Map<number, string>();

  loading = false;
  processingId: number | null = null;
  processingAction: 'accept' | 'refuse' | null = null;

  constructor(
    private justificatifService: JustificatifService,
    private notify: NotificationService,
  ) {}

  ngOnInit(): void {
    this.loadJustificatifs();
  }

  loadJustificatifs(): void {
    this.loading = true;
    this.justificatifService.getAValider().subscribe({
      next: (data) => {
        this.justificatifs = data;
        data.forEach((j) => {
          if (!this.comments.has(j.id)) {
            this.comments.set(j.id, '');
          }
        });
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.notify.error('Erreur lors du chargement des justificatifs.');
        this.loading = false;
        this.cdr.markForCheck();
      },
    });
  }

  getComment(id: number): string {
    return this.comments.get(id) ?? '';
  }

  setComment(id: number, value: string): void {
    this.comments.set(id, value);
  }

  accepter(j: Justificatif): void {
    this.process(j.id, true);
  }

  refuser(j: Justificatif): void {
    this.process(j.id, false);
  }

  private process(id: number, accepter: boolean): void {
    this.processingId = id;
    this.processingAction = accepter ? 'accept' : 'refuse';
    const commentaire = this.comments.get(id) || undefined;

    this.justificatifService.valider(id, accepter, commentaire).subscribe({
      next: () => {
        this.notify.success(
          accepter ? 'Justificatif accepté avec succès.' : 'Justificatif refusé.',
        );
        this.processingId = null;
        this.processingAction = null;
        this.comments.delete(id);
        this.loadJustificatifs();
        this.cdr.markForCheck();
      },
      error: () => {
        this.notify.error('Erreur lors du traitement du justificatif.');
        this.processingId = null;
        this.processingAction = null;
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
