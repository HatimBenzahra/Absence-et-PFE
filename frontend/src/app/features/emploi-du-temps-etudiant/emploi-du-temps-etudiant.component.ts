import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Seance, TypeSeance } from '../../core/models/seance.model';
import { SeanceService } from '../../core/services/seance.service';
import { NotificationService } from '../../shared/services/notification.service';

interface CalendarEvent {
  seance: Seance;
  dayIndex: number;
  topPercent: number;
  heightPercent: number;
  color: string;
  label: string;
}

@Component({
  selector: 'app-emploi-du-temps-etudiant',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './emploi-du-temps-etudiant.component.html',
  styleUrl: './emploi-du-temps-etudiant.component.scss',
})
export class EmploiDuTempsEtudiantComponent implements OnInit {
  private cdr = inject(ChangeDetectorRef);

  seances: Seance[] = [];
  events: CalendarEvent[] = [];
  loading = true;

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
    private seanceService: SeanceService,
    private notification: NotificationService,
  ) {}

  ngOnInit(): void {
    this.setWeek(new Date());
    this.loadSeances();
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
    this.buildEvents();
  }

  nextWeek(): void {
    const d = new Date(this.weekStart);
    d.setDate(d.getDate() + 7);
    this.setWeek(d);
    this.buildEvents();
  }

  goToday(): void {
    this.setWeek(new Date());
    this.buildEvents();
  }

  loadSeances(): void {
    this.loading = true;
    this.seanceService.getMonEmploiDuTemps().subscribe({
      next: (data) => {
        this.seances = data;
        this.buildEvents();
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.notification.error('Impossible de charger votre emploi du temps.');
        this.loading = false;
        this.cdr.markForCheck();
      },
    });
  }

  buildEvents(): void {
    this.events = [];
    const weekStartTime = this.weekStart.getTime();
    const weekEndDate = new Date(this.weekStart);
    weekEndDate.setDate(weekEndDate.getDate() + 6);
    const weekEndTime = weekEndDate.getTime();

    for (const s of this.seances) {
      const debut = new Date(s.dateHeureDebut);
      const fin = new Date(s.dateHeureFin);

      if (debut.getTime() < weekStartTime || debut.getTime() >= weekEndTime) {
        continue;
      }

      const dayIndex = (debut.getDay() + 6) % 7; // 0=Mon
      if (dayIndex > 5) continue;

      const startMinutes = debut.getHours() * 60 + debut.getMinutes();
      const endMinutes = fin.getHours() * 60 + fin.getMinutes();
      const gridStart = this.START_HOUR * 60;
      const gridEnd = this.END_HOUR * 60;
      const gridTotal = gridEnd - gridStart;

      const topPercent = Math.max(0, ((startMinutes - gridStart) / gridTotal) * 100);
      const heightPercent = Math.max(2, ((endMinutes - startMinutes) / gridTotal) * 100);

      this.events.push({
        seance: s,
        dayIndex,
        topPercent,
        heightPercent,
        color: this.typeColor(s.typeSeance),
        label: this.typeLabel(s.typeSeance),
      });
    }
    this.cdr.markForCheck();
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

  formatTime(iso: string): string {
    const d = new Date(iso);
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  }

  eventsForDay(dayIndex: number): CalendarEvent[] {
    return this.events.filter((e) => e.dayIndex === dayIndex);
  }
}
