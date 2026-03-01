import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { BaseChartDirective } from 'ng2-charts';
import {
  Chart,
  ChartConfiguration,
  ChartData,
  ArcElement,
  Tooltip,
  Legend,
  PieController,
  BarController,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';
import { Observable } from 'rxjs';

import { StatistiquesService } from '../../core/services/statistiques.service';
import { NotificationService } from '../../shared/services/notification.service';
import { Statistiques } from '../../core/models/statistiques.model';

Chart.register(
  ArcElement,
  Tooltip,
  Legend,
  PieController,
  BarController,
  CategoryScale,
  LinearScale,
  BarElement,
);

@Component({
  selector: 'app-statistiques',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatIconModule,
    BaseChartDirective,
  ],
  templateUrl: './statistiques.component.html',
  styleUrl: './statistiques.component.scss',
})
export class StatistiquesComponent {
  private cdr = inject(ChangeDetectorRef);
  etudiantForm: FormGroup;
  groupeForm: FormGroup;
  matiereForm: FormGroup;

  loading = false;
  stats: Statistiques | null = null;
  hasSearched = false;

  pieChartData: ChartData<'pie'> = {
    labels: ['Présent', 'Absent', 'Retard'],
    datasets: [
      {
        data: [0, 0, 0],
        backgroundColor: ['#4caf50', '#ef5350', '#ff9800'],
        borderWidth: 3,
        borderColor: '#ffffff',
        hoverOffset: 6,
      },
    ],
  };

  barChartData: ChartData<'bar'> = {
    labels: ["Taux d'assiduité (%)"],
    datasets: [
      {
        label: "Taux d'assiduité",
        data: [0],
        backgroundColor: 'rgba(0, 151, 196, 0.85)',
        borderRadius: 10,
        borderSkipped: false,
      },
    ],
  };

  pieChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          font: { size: 13 },
        },
      },
    },
  };

  barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    scales: {
      y: {
        min: 0,
        max: 100,
        ticks: {
          callback: (value) => `${value}%`,
        },
        grid: { color: 'rgba(0,0,0,0.06)' },
      },
      x: {
        grid: { display: false },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ${(ctx.parsed.y ?? 0).toFixed(1)}%`,
        },
      },
    },
  };

  constructor(
    private fb: FormBuilder,
    private statistiquesService: StatistiquesService,
    private notificationService: NotificationService,
  ) {
    this.etudiantForm = this.fb.group({
      etudiantId: ['', [Validators.required]],
    });
    this.groupeForm = this.fb.group({
      groupe: ['', Validators.required],
    });
    this.matiereForm = this.fb.group({
      matiere: ['', Validators.required],
    });
  }

  searchByEtudiant(): void {
    if (this.etudiantForm.invalid) return;
    const id = Number(this.etudiantForm.value.etudiantId);
    this.fetchStats(this.statistiquesService.getByEtudiant(id));
  }

  searchByGroupe(): void {
    if (this.groupeForm.invalid) return;
    this.fetchStats(this.statistiquesService.getByGroupe(this.groupeForm.value.groupe));
  }

  searchByMatiere(): void {
    if (this.matiereForm.invalid) return;
    this.fetchStats(this.statistiquesService.getByMatiere(this.matiereForm.value.matiere));
  }

  onTabChange(): void {
    this.hasSearched = false;
    this.stats = null;
  }

  private fetchStats(obs: Observable<Statistiques>): void {
    this.loading = true;
    this.hasSearched = false;
    obs.subscribe({
      next: (data) => {
        this.stats = data;
        this.updateCharts(data);
        this.hasSearched = true;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.notificationService.error('Erreur lors du chargement des statistiques');
        this.loading = false;
        this.cdr.markForCheck();
      },
    });
  }

  private updateCharts(data: Statistiques): void {
    this.pieChartData = {
      ...this.pieChartData,
      datasets: [
        {
          ...this.pieChartData.datasets[0],
          data: [data.totalPresent, data.totalAbsent, data.totalRetard],
        },
      ],
    };

    this.barChartData = {
      ...this.barChartData,
      datasets: [
        {
          ...this.barChartData.datasets[0],
          data: [data.tauxAssiduite],
        },
      ],
    };
  }
}
