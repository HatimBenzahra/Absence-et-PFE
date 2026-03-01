import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Sujet, StatutSujet } from '../../core/models/sujet.model';
import { SujetService } from '../../core/services/sujet.service';
import { NotificationService } from '../../shared/services/notification.service';

@Component({
  selector: 'app-sujets',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatChipsModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './sujets.component.html',
  styleUrl: './sujets.component.scss',
})
export class SujetsComponent implements OnInit {
  private cdr = inject(ChangeDetectorRef);
  sujets: Sujet[] = [];
  loading = true;
  displayedColumns = ['titre', 'description', 'motsCles', 'enseignantNom', 'statut', 'actions'];

  constructor(
    private sujetService: SujetService,
    private notification: NotificationService,
  ) {}

  ngOnInit(): void {
    this.sujetService.getAll().subscribe({
      next: (data) => {
        this.sujets = data;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.notification.error('Impossible de charger les sujets PFE.');
        this.loading = false;
        this.cdr.markForCheck();
      },
    });
  }

  truncate(text: string, max = 80): string {
    return text.length > max ? text.slice(0, max) + '...' : text;
  }

  motsClesArray(motsCles: string): string[] {
    return motsCles
      .split(',')
      .map((m) => m.trim())
      .filter((m) => m.length > 0);
  }

  statutClass(statut: StatutSujet): string {
    const map: Record<StatutSujet, string> = {
      [StatutSujet.VALIDE]: 'chip-valide',
      [StatutSujet.EN_ATTENTE]: 'chip-en-attente',
      [StatutSujet.REFUSE]: 'chip-refuse',
      [StatutSujet.AFFECTE]: 'chip-valide',
    };
    return map[statut] ?? '';
  }

  statutLabel(statut: StatutSujet): string {
    const map: Record<StatutSujet, string> = {
      [StatutSujet.VALIDE]: 'Validé',
      [StatutSujet.EN_ATTENTE]: 'En attente',
      [StatutSujet.REFUSE]: 'Refusé',
      [StatutSujet.AFFECTE]: 'Affecté',
    };
    return map[statut] ?? statut;
  }
}
