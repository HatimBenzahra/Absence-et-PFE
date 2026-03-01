import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { SeanceService } from '../../core/services/seance.service';
import { NotificationService } from '../../shared/services/notification.service';
import { EnseignantOption, Seance, SeanceCreate, TypeSeance } from '../../core/models/seance.model';

interface CalendarEvent {
  seance: Seance;
  dayIndex: number;
  topPercent: number;
  heightPercent: number;
  color: string;
  label: string;
}

@Component({
  selector: 'app-emploi-du-temps',
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
    MatButtonToggleModule,
  ],
  templateUrl: './emploi-du-temps.component.html',
  styleUrl: './emploi-du-temps.component.scss',
})
export class EmploiDuTempsComponent implements OnInit {
  private cdr = inject(ChangeDetectorRef);

  createForm: FormGroup;
  enseignants: EnseignantOption[] = [];
  seances: Seance[] = [];
  displayedColumns = ['matiere', 'typeSeance', 'dateHeureDebut', 'dateHeureFin', 'groupe', 'salle', 'enseignantNom'];
  TypeSeance = TypeSeance;

  loadingSeances = false;
  loadingEnseignants = false;
  submitting = false;

  // Calendar state
  viewMode: 'list' | 'calendar' = 'list';
  selectedGroupe: string | null = null;
  groupes: string[] = [];
  calendarEvents: CalendarEvent[] = [];

  weekStart!: Date;
  weekEnd!: Date;
  weekLabel = '';
  days: { label: string; date: Date; isToday: boolean }[] = [];

  readonly START_HOUR = 8;
  readonly END_HOUR = 19;
  readonly TOTAL_HOURS = 19 - 8;
  hours = Array.from({ length: this.TOTAL_HOURS }, (_, i) => i + this.START_HOUR);
  readonly DAY_NAMES = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  constructor(
    private fb: FormBuilder,
    private seanceService: SeanceService,
    private notify: NotificationService,
  ) {
    this.createForm = this.fb.group({
      matiere: ['', [Validators.required]],
      typeSeance: ['', [Validators.required]],
      dateHeureDebut: ['', [Validators.required]],
      dateHeureFin: ['', [Validators.required]],
      groupe: [''],
      salle: [''],
      enseignantId: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.setWeek(new Date());
    this.loadEnseignants();
    this.loadSeances();
  }

  // ─── Data loading ────────────────────────────────────────────────────────

  loadEnseignants(): void {
    this.loadingEnseignants = true;
    this.seanceService.getEnseignants().subscribe({
      next: (data) => {
        this.enseignants = data as EnseignantOption[];
        this.loadingEnseignants = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.notify.error('Erreur lors du chargement des enseignants.');
        this.loadingEnseignants = false;
        this.cdr.markForCheck();
      },
    });
  }

  loadSeances(): void {
    this.loadingSeances = true;
    this.seanceService.getAllSeances().subscribe({
      next: (data) => {
        this.seances = data;
        this.extractGroupes();
        this.buildCalendarEvents();
        this.loadingSeances = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.notify.error('Erreur lors du chargement des séances.');
        this.loadingSeances = false;
        this.cdr.markForCheck();
      },
    });
  }

  // ─── Form ────────────────────────────────────────────────────────────────

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
    const enseignantId = Number(raw.enseignantId);

    this.seanceService.createForEnseignant(payload, enseignantId).subscribe({
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

  // ─── Calendar logic ──────────────────────────────────────────────────────

  extractGroupes(): void {
    const set = new Set<string>();
    for (const s of this.seances) {
      if (s.groupe) set.add(s.groupe);
    }
    this.groupes = Array.from(set).sort();
    if (this.groupes.length > 0 && !this.selectedGroupe) {
      this.selectedGroupe = this.groupes[0];
    }
  }

  onGroupeChange(groupe: string): void {
    this.selectedGroupe = groupe;
    this.buildCalendarEvents();
  }

  setWeek(date: Date): void {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    this.weekStart = new Date(d.setDate(diff));
    this.weekStart.setHours(0, 0, 0, 0);
    this.weekEnd = new Date(this.weekStart);
    this.weekEnd.setDate(this.weekStart.getDate() + 5);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    this.days = this.DAY_NAMES.map((label, i) => {
      const dt = new Date(this.weekStart);
      dt.setDate(this.weekStart.getDate() + i);
      return { label, date: dt, isToday: dt.getTime() === today.getTime() };
    });

    const fmt = (d: Date) => `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
    const fmtFull = (d: Date) => `${fmt(d)}/${d.getFullYear()}`;
    this.weekLabel = `Semaine du ${fmt(this.weekStart)} au ${fmtFull(this.weekEnd)}`;
  }

  prevWeek(): void {
    const d = new Date(this.weekStart);
    d.setDate(d.getDate() - 7);
    this.setWeek(d);
    this.buildCalendarEvents();
  }

  nextWeek(): void {
    const d = new Date(this.weekStart);
    d.setDate(d.getDate() + 7);
    this.setWeek(d);
    this.buildCalendarEvents();
  }

  goToday(): void {
    this.setWeek(new Date());
    this.buildCalendarEvents();
  }

  buildCalendarEvents(): void {
    this.calendarEvents = [];
    if (!this.selectedGroupe) return;

    const weekStartTime = this.weekStart.getTime();
    const weekEndDate = new Date(this.weekStart);
    weekEndDate.setDate(weekEndDate.getDate() + 6);
    const weekEndTime = weekEndDate.getTime();

    const filtered = this.seances.filter((s) => s.groupe === this.selectedGroupe);

    for (const s of filtered) {
      const debut = new Date(s.dateHeureDebut);
      const fin = new Date(s.dateHeureFin);
      if (debut.getTime() < weekStartTime || debut.getTime() >= weekEndTime) continue;

      const dayIndex = (debut.getDay() + 6) % 7;
      if (dayIndex > 5) continue;

      const startMinutes = debut.getHours() * 60 + debut.getMinutes();
      const endMinutes = fin.getHours() * 60 + fin.getMinutes();
      const gridStart = this.START_HOUR * 60;
      const gridEnd = this.END_HOUR * 60;
      const gridTotal = gridEnd - gridStart;

      this.calendarEvents.push({
        seance: s,
        dayIndex,
        topPercent: Math.max(0, ((startMinutes - gridStart) / gridTotal) * 100),
        heightPercent: Math.max(2, ((endMinutes - startMinutes) / gridTotal) * 100),
        color: this.typeColor(s.typeSeance),
        label: this.typeLabel(s.typeSeance),
      });
    }
    this.cdr.markForCheck();
  }

  eventsForDay(dayIndex: number): CalendarEvent[] {
    return this.calendarEvents.filter((e) => e.dayIndex === dayIndex);
  }

  // ─── Labels ──────────────────────────────────────────────────────────────

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

  typeLabel(type: TypeSeance): string {
    const map: Record<TypeSeance, string> = {
      [TypeSeance.CM]: 'CM',
      [TypeSeance.TD]: 'TD',
      [TypeSeance.TP]: 'TP',
      [TypeSeance.EXAMEN]: 'Examen',
      [TypeSeance.SOUTENANCE]: 'Soutenance',
    };
    return map[type] ?? type;
  }

  typeColor(type: TypeSeance): string {
    const map: Record<TypeSeance, string> = {
      [TypeSeance.CM]: '#0097c4',
      [TypeSeance.TD]: '#15803d',
      [TypeSeance.TP]: '#d97706',
      [TypeSeance.EXAMEN]: '#dc2626',
      [TypeSeance.SOUTENANCE]: '#6d1d4a',
    };
    return map[type] ?? '#64748b';
  }

  enseignantLabel(enseignant: EnseignantOption): string {
    return `${enseignant.prenom} ${enseignant.nom}`;
  }

  formatTime(iso: string): string {
    const d = new Date(iso);
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  }
}
