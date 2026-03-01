import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { PresenceService } from '../../core/services/presence.service';
import { NotificationService } from '../../shared/services/notification.service';
import { Presence } from '../../core/models/presence.model';

@Component({
  selector: 'app-scanner',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.scss'],
})
export class ScannerComponent {
  private cdr = inject(ChangeDetectorRef);
  form: FormGroup;
  isLoading = false;
  result: Presence | null = null;

  constructor(
    private fb: FormBuilder,
    private presenceService: PresenceService,
    private notification: NotificationService
  ) {
    this.form = this.fb.group({
      tokenQR: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  get tokenQR() {
    return this.form.get('tokenQR');
  }

  submit(): void {
    if (this.form.invalid || this.isLoading) return;

    this.isLoading = true;
    this.result = null;

    const tokenQR = this.tokenQR?.value?.trim();

    this.presenceService.pointer({ tokenQR }).subscribe({
      next: (presence: Presence) => {
        this.isLoading = false;
        this.result = presence;
        this.notification.success('Présence enregistrée !');
        this.form.reset();
        this.cdr.markForCheck();
      },
      error: (err: { error?: { message?: string } }) => {
        this.isLoading = false;
        this.notification.error(err.error?.message || 'Erreur lors du pointage');
        this.cdr.markForCheck();
      },
    });
  }

  formatDate(isoString: string): string {
    return new Date(isoString).toLocaleString('fr-FR', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  }

  statutLabel(statut: string): string {
    const labels: Record<string, string> = {
      PRESENT: 'Présent',
      ABSENT: 'Absent',
      RETARD: 'En retard',
      EXCUSE: 'Excusé',
    };
    return labels[statut] ?? statut;
  }
}
