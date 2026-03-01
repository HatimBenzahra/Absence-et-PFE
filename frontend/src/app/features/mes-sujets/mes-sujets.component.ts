import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Sujet, StatutSujet } from '../../core/models/sujet.model';
import { SujetService } from '../../core/services/sujet.service';
import { NotificationService } from '../../shared/services/notification.service';

@Component({
  selector: 'app-mes-sujets',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatChipsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './mes-sujets.component.html',
  styleUrl: './mes-sujets.component.scss',
})
export class MesSujetsComponent implements OnInit {
  private cdr = inject(ChangeDetectorRef);
  sujets: Sujet[] = [];
  loading = true;
  submitting = false;
  displayedColumns = ['titre', 'description', 'motsCles', 'statut', 'dateCreation'];
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private sujetService: SujetService,
    private notification: NotificationService,
  ) {
    this.form = this.fb.group({
      titre: ['', [Validators.required]],
      description: ['', [Validators.required]],
      motsCles: [''],
    });
  }

  ngOnInit(): void {
    this.loadMesSujets();
  }

  loadMesSujets(): void {
    this.loading = true;
    this.sujetService.getMesSujets().subscribe({
      next: (data) => {
        this.sujets = data;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.notification.error('Impossible de charger vos sujets.');
        this.loading = false;
        this.cdr.markForCheck();
      },
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.submitting = true;
    const val = this.form.value;
    this.sujetService
      .create({
        titre: val.titre,
        description: val.description,
        motsCles: val.motsCles ?? '',
      })
      .subscribe({
        next: () => {
          this.notification.success('Sujet proposé avec succès.');
          this.form.reset();
          this.loadMesSujets();
          this.submitting = false;
          this.cdr.markForCheck();
        },
        error: () => {
          this.notification.error('Erreur lors de la proposition du sujet.');
          this.submitting = false;
          this.cdr.markForCheck();
        },
      });
  }

  truncate(text: string, max = 80): string {
    return text.length > max ? text.slice(0, max) + '...' : text;
  }

  motsClesArray(motsCles: string): string[] {
    if (!motsCles) return [];
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
