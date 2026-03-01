import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { Soutenance, SoutenanceCreate } from '../../core/models/soutenance.model';
import { SoutenanceService } from '../../core/services/soutenance.service';
import { NotificationService } from '../../shared/services/notification.service';

@Component({
  selector: 'app-soutenances',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './soutenances.component.html',
  styleUrls: ['./soutenances.component.scss'],
})
export class SoutenancesComponent implements OnInit {
  private cdr = inject(ChangeDetectorRef);
  form: FormGroup;
  soutenances: Soutenance[] = [];
  displayedColumns = ['etudiantNom', 'sujetTitre', 'dateSoutenance', 'lieu', 'jury', 'actions'];
  isSubmitting = false;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private soutenanceService: SoutenanceService,
    private notification: NotificationService,
  ) {
    this.form = this.fb.group({
      affectationId: [null, [Validators.required, Validators.min(1)]],
      dateSoutenance: ['', [Validators.required]],
      lieu: [''],
      jury: [''],
    });
  }

  ngOnInit(): void {
    this.loadSoutenances();
  }

  loadSoutenances(): void {
    this.isLoading = true;
    this.soutenanceService.getAll().subscribe({
      next: (data) => {
        this.soutenances = data;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.notification.error('Impossible de charger les soutenances.');
        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
  }

  onSubmit(): void {
    if (this.form.invalid || this.isSubmitting) return;

    this.isSubmitting = true;
    const { affectationId, dateSoutenance, lieu, jury } = this.form.value;

    const payload: SoutenanceCreate = {
      affectationId: Number(affectationId),
      dateSoutenance: new Date(dateSoutenance).toISOString(),
    };

    if (lieu?.trim()) payload.lieu = lieu.trim();
    if (jury?.trim()) payload.jury = jury.trim();

    this.soutenanceService.planifier(payload).subscribe({
      next: () => {
        this.notification.success('Soutenance planifiée avec succès.');
        this.form.reset();
        this.isSubmitting = false;
        this.loadSoutenances();
        this.cdr.markForCheck();
      },
      error: () => {
        this.notification.error('Échec de la planification. Vérifiez vos données.');
        this.isSubmitting = false;
        this.cdr.markForCheck();
      },
    });
  }

  onDelete(id: number): void {
    this.soutenanceService.delete(id).subscribe({
      next: () => {
        this.notification.success('Soutenance supprimée.');
        this.loadSoutenances();
        this.cdr.markForCheck();
      },
      error: () => {
        this.notification.error('Impossible de supprimer la soutenance.');
        this.cdr.markForCheck();
      },
    });
  }

  getInitials(name: string): string {
    return (name || '?').substring(0, 2).toUpperCase();
  }
}
