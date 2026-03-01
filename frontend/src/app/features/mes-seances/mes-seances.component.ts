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
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SeanceService } from '../../core/services/seance.service';
import { PresenceService } from '../../core/services/presence.service';
import { NotificationService } from '../../shared/services/notification.service';
import { Seance, SeanceCreate, TypeSeance } from '../../core/models/seance.model';
import { Presence } from '../../core/models/presence.model';

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
    MatAutocompleteModule,
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

  /** Unique matières from teacher's previous séances */
  matiereOptions: string[] = [];
  filteredMatieres: string[] = [];

  loadingList = false;
  submitting = false;
  generatingQr: number | null = null;
  generatedToken: string | null = null;
  generatedTokenSeanceId: number | null = null;

  /** Presence detail panel */
  selectedSeance: Seance | null = null;
  selectedPresences: Presence[] = [];
  loadingPresences = false;
  presenceColumns = ['etudiantNom', 'etudiantNumero', 'statut', 'modeSaisie', 'horodatage'];

  constructor(
    private fb: FormBuilder,
    private seanceService: SeanceService,
    private presenceService: PresenceService,
    private notify: NotificationService
  ) {
    const today = new Date().toISOString().slice(0, 10);
    this.createForm = this.fb.group({
      matiere: ['', [Validators.required]],
      typeSeance: ['', [Validators.required]],
      date: [today, [Validators.required]],
      heureDebut: ['08:00', [Validators.required]],
      heureFin: ['10:00', [Validators.required]],
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
        this.extractMatiereOptions();
        this.cdr.markForCheck();
      },
      error: () => {
        this.notify.error('Erreur lors du chargement des séances.');
        this.loadingList = false;
        this.cdr.markForCheck();
      },
    });
  }

  /** Extract unique matières and pre-fill the most used one */
  private extractMatiereOptions(): void {
    const counts = new Map<string, number>();
    for (const s of this.seances) {
      if (s.matiere) {
        counts.set(s.matiere, (counts.get(s.matiere) ?? 0) + 1);
      }
    }

    // Sort by frequency (most used first)
    this.matiereOptions = [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([m]) => m);

    this.filteredMatieres = [...this.matiereOptions];

    // Pre-fill with the most frequently used matière
    if (this.matiereOptions.length > 0 && !this.createForm.get('matiere')?.value) {
      this.createForm.patchValue({ matiere: this.matiereOptions[0] });
    }
  }

  /** Filter matière suggestions as user types */
  filterMatieres(): void {
    const val = (this.createForm.get('matiere')?.value ?? '').toLowerCase();
    this.filteredMatieres = val
      ? this.matiereOptions.filter(m => m.toLowerCase().includes(val))
      : [...this.matiereOptions];
  }

  onSubmit(): void {
    if (this.createForm.invalid) return;

    this.submitting = true;
    const raw = this.createForm.value;

    // Combine date + time into ISO datetime strings
    const dateHeureDebut = `${raw.date}T${raw.heureDebut}:00`;
    const dateHeureFin = `${raw.date}T${raw.heureFin}:00`;

    const payload: SeanceCreate = {
      matiere: raw.matiere as string,
      typeSeance: raw.typeSeance as TypeSeance,
      dateHeureDebut,
      dateHeureFin,
      ...(raw.groupe ? { groupe: raw.groupe as string } : {}),
      ...(raw.salle ? { salle: raw.salle as string } : {}),
    };

    this.seanceService.create(payload).subscribe({
      next: () => {
        this.notify.success('Séance créée avec succès !');
        // Keep matière pre-filled for convenience
        const keepMatiere = raw.matiere;
        this.createForm.reset({
          matiere: keepMatiere,
          date: raw.date,
          heureDebut: '08:00',
          heureFin: '10:00',
        });
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

  /** Toggle presence detail panel for a séance */
  onSeanceClick(seance: Seance): void {
    // Toggle off if same row clicked
    if (this.selectedSeance?.id === seance.id) {
      this.selectedSeance = null;
      this.selectedPresences = [];
      return;
    }

    this.selectedSeance = seance;
    this.loadingPresences = true;
    this.selectedPresences = [];
    this.cdr.markForCheck();

    this.presenceService.getPresencesBySeance(seance.id).subscribe({
      next: (data) => {
        this.selectedPresences = data;
        this.loadingPresences = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.notify.error('Erreur lors du chargement des présences.');
        this.loadingPresences = false;
        this.cdr.markForCheck();
      },
    });
  }

  /** Close the presence detail panel */
  closePresencePanel(): void {
    this.selectedSeance = null;
    this.selectedPresences = [];
  }

  /** Count presences by status */
  countByStatut(statut: string): number {
    return this.selectedPresences.filter(p => p.statut === statut).length;
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

  /** QR code image URL from free API (zero npm dependency) */
  get qrCodeUrl(): string {
    if (!this.generatedToken) return '';
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(this.generatedToken)}`;
  }

  /** Find the séance matière for display in the QR card */
  get generatedTokenSeanceMatiere(): string {
    if (!this.generatedTokenSeanceId) return '';
    return this.seances.find(s => s.id === this.generatedTokenSeanceId)?.matiere ?? '';
  }

  typeSeanceLabel(type: TypeSeance): string {
    const labels: Record<TypeSeance, string> = {
      [TypeSeance.CM]: 'Cours magistral',
      [TypeSeance.TD]: 'TD',
      [TypeSeance.TP]: 'TP',
      [TypeSeance.EXAMEN]: 'Examen',
      [TypeSeance.SOUTENANCE]: 'Soutenance',
    };
    return labels[type] ?? type;
  }

  statutLabel(statut: string): string {
    const labels: Record<string, string> = {
      PRESENT: 'Présent',
      ABSENT: 'Absent',
      RETARD: 'Retard',
      EXCUSE: 'Excusé',
    };
    return labels[statut] ?? statut;
  }

  statutClass(statut: string): string {
    const classes: Record<string, string> = {
      PRESENT: 'statut--present',
      ABSENT: 'statut--absent',
      RETARD: 'statut--retard',
      EXCUSE: 'statut--excuse',
    };
    return classes[statut] ?? '';
  }
}
