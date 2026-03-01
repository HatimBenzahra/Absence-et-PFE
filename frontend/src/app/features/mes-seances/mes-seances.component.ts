import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SeanceService } from '../../core/services/seance.service';
import { NotificationService } from '../../shared/services/notification.service';
import { Seance, SeanceCreate, TypeSeance } from '../../core/models/seance.model';

@Component({
  selector: 'app-mes-seances',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './mes-seances.component.html',
  styleUrl: './mes-seances.component.scss',
})
export class MesSeancesComponent implements OnInit {
  private cdr = inject(ChangeDetectorRef);
  createForm: FormGroup;
  seances: Seance[] = [];
  displayedColumns = ['matiere', 'typeSeance', 'dateHeureDebut', 'dateHeureFin', 'groupe', 'salle', 'actions'];
  TypeSeance = TypeSeance;

  loadingList = false;
  submitting = false;
  generatingQr: number | null = null;
  generatedToken: string | null = null;
  generatedTokenSeanceId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private seanceService: SeanceService,
    private notify: NotificationService
  ) {
    this.createForm = this.fb.group({
      matiere: ['', [Validators.required]],
      typeSeance: ['', [Validators.required]],
      dateHeureDebut: ['', [Validators.required]],
      dateHeureFin: ['', [Validators.required]],
      groupe: [''],
      salle: [''],
    });
  }

  ngOnInit(): void {
    this.loadSeances();
  }

  loadSeances(): void {
    this.loadingList = true;
    this.seanceService.getMySeances().subscribe({
      next: (data) => {
        this.seances = data;
        this.loadingList = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.notify.error('Erreur lors du chargement des séances.');
        this.loadingList = false;
        this.cdr.markForCheck();
      },
    });
  }

  onSubmit(): void {
    if (this.createForm.invalid) return;

    this.submitting = true;
    const raw = this.createForm.value;
    const payload: SeanceCreate = {
      matiere: raw.matiere as string,
      typeSeance: raw.typeSeance as TypeSeance,
      dateHeureDebut: raw.dateHeureDebut as string,
      dateHeureFin: raw.dateHeureFin as string,
      ...(raw.groupe ? { groupe: raw.groupe as string } : {}),
      ...(raw.salle ? { salle: raw.salle as string } : {}),
    };

    this.seanceService.create(payload).subscribe({
      next: () => {
        this.notify.success('Séance créée avec succès !');
        this.createForm.reset();
        this.submitting = false;
        this.loadSeances();
        this.cdr.markForCheck();
      },
      error: () => {
        this.notify.error('Erreur lors de la création de la séance.');
        this.submitting = false;
        this.cdr.markForCheck();
      },
    });
  }

  generateQr(seance: Seance): void {
    this.generatingQr = seance.id;
    this.seanceService.generateQrCode(seance.id).subscribe({
      next: (res) => {
        this.generatedToken = res.tokenQR;
        this.generatedTokenSeanceId = seance.id;
        this.generatingQr = null;
        this.notify.success('Token QR généré avec succès !');
        this.cdr.markForCheck();
      },
      error: () => {
        this.notify.error('Erreur lors de la génération du code QR.');
        this.generatingQr = null;
        this.cdr.markForCheck();
      },
    });
  }

  typeSeanceLabel(type: TypeSeance): string {
    const labels: Record<TypeSeance, string> = {
      [TypeSeance.COURS]: 'Cours',
      [TypeSeance.TD]: 'TD',
      [TypeSeance.TP]: 'TP',
      [TypeSeance.EXAMEN]: 'Examen',
    };
    return labels[type] ?? type;
  }
}
