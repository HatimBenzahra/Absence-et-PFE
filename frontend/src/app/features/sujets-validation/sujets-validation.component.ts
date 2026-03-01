import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Sujet, StatutSujet } from '../../core/models/sujet.model';
import { SujetService } from '../../core/services/sujet.service';
import { NotificationService } from '../../shared/services/notification.service';

@Component({
  selector: 'app-sujets-validation',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatChipsModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './sujets-validation.component.html',
  styleUrl: './sujets-validation.component.scss',
})
export class SujetsValidationComponent implements OnInit {
  private cdr = inject(ChangeDetectorRef);
  sujets: Sujet[] = [];
  loading = true;
  actionLoading = new Set<number>();
  displayedColumns = ['titre', 'description', 'motsCles', 'enseignantNom', 'dateCreation', 'actions'];

  constructor(
    private sujetService: SujetService,
    private notification: NotificationService,
  ) {}

  ngOnInit(): void {
    this.loadSujets();
  }

  loadSujets(): void {
    this.loading = true;
    this.sujetService.getEnAttente().subscribe({
      next: (data) => {
        this.sujets = data;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.notification.error('Impossible de charger les sujets.');
        this.loading = false;
        this.cdr.markForCheck();
      },
    });
  }

  valider(sujet: Sujet): void {
    this.actionLoading.add(sujet.id);
    this.sujetService.valider(sujet.id).subscribe({
      next: () => {
        this.actionLoading.delete(sujet.id);
        this.notification.success(`Sujet "${sujet.titre}" validé avec succès.`);
        this.loadSujets();
        this.cdr.markForCheck();
      },
      error: () => {
        this.actionLoading.delete(sujet.id);
        this.notification.error('Impossible de valider ce sujet.');
        this.cdr.markForCheck();
      },
    });
  }

  refuser(sujet: Sujet): void {
    this.actionLoading.add(sujet.id);
    this.sujetService.refuser(sujet.id).subscribe({
      next: () => {
        this.actionLoading.delete(sujet.id);
        this.notification.success(`Sujet "${sujet.titre}" refusé.`);
        this.loadSujets();
        this.cdr.markForCheck();
      },
      error: () => {
        this.actionLoading.delete(sujet.id);
        this.notification.error('Impossible de refuser ce sujet.');
        this.cdr.markForCheck();
      },
    });
  }

  isActionLoading(id: number): boolean {
    return this.actionLoading.has(id);
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
}
