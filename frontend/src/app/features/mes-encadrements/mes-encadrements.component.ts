import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';

import { Affectation, StatutAffectation } from '../../core/models/affectation.model';
import { Livrable } from '../../core/models/livrable.model';
import { AffectationService } from '../../core/services/affectation.service';
import { LivrableService } from '../../core/services/livrable.service';
import { NotificationService } from '../../shared/services/notification.service';

@Component({
  selector: 'app-mes-encadrements',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatChipsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
  ],
  templateUrl: './mes-encadrements.component.html',
  styleUrls: ['./mes-encadrements.component.scss'],
})
export class MesEncadrementsComponent implements OnInit {
  private cdr = inject(ChangeDetectorRef);
  encadrements: Affectation[] = [];
  isLoading = false;

  displayedColumns = ['etudiantNom', 'sujetTitre', 'statut', 'dateAffectation', 'actions'];

  expandedRows = new Set<number>();
  livrables = new Map<number, Livrable[]>();
  livrableLoading = new Set<number>();

  readonly StatutAffectation = StatutAffectation;

  constructor(
    private affectationService: AffectationService,
    private livrableService: LivrableService,
    private notification: NotificationService,
  ) {}

  ngOnInit(): void {
    this.loadEncadrements();
  }

  loadEncadrements(): void {
    this.isLoading = true;
    this.affectationService.getMesEncadrements().subscribe({
      next: (data) => {
        this.encadrements = data;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.notification.error('Impossible de charger vos encadrements.');
        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
  }

  toggleLivrables(id: number): void {
    if (this.expandedRows.has(id)) {
      this.expandedRows.delete(id);
      return;
    }

    this.expandedRows.add(id);

    if (!this.livrables.has(id)) {
      this.livrableLoading.add(id);
      this.livrableService.getLivrablesByAffectation(id).subscribe({
        next: (data) => {
          this.livrables.set(id, data);
          this.livrableLoading.delete(id);
          this.cdr.markForCheck();
        },
        error: () => {
          this.notification.error('Impossible de charger les livrables.');
          this.livrableLoading.delete(id);
          this.expandedRows.delete(id);
          this.cdr.markForCheck();
        },
      });
    }
  }

  isExpanded(id: number): boolean {
    return this.expandedRows.has(id);
  }

  getLivrables(id: number): Livrable[] {
    return this.livrables.get(id) ?? [];
  }

  isLivrableLoading(id: number): boolean {
    return this.livrableLoading.has(id);
  }

  onTerminer(id: number): void {
    if (!window.confirm('Marquer ce PFE comme terminé ?')) return;

    this.affectationService.terminer(id).subscribe({
      next: () => {
        this.notification.success('PFE marqué comme terminé.');
        this.loadEncadrements();
        this.cdr.markForCheck();
      },
      error: () => {
        this.notification.error('Impossible de terminer ce PFE.');
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
      [StatutAffectation.EN_COURS]: 'chip--blue',
      [StatutAffectation.TERMINE]: 'chip--green',
      [StatutAffectation.ABANDONNE]: 'chip--red',
    };
    return map[statut] ?? '';
  }
}
