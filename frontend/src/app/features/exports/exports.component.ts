import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ExportService } from '../../core/services/export.service';
import { NotificationService } from '../../shared/services/notification.service';

@Component({
  selector: 'app-exports',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './exports.component.html',
  styleUrl: './exports.component.scss',
})
export class ExportsComponent {
  private cdr = inject(ChangeDetectorRef);
  csvGroupe = '';
  pdfGroupe = '';
  csvLoading = false;
  pdfLoading = false;

  constructor(
    private exportService: ExportService,
    private notificationService: NotificationService,
  ) {}

  downloadCSV(): void {
    this.csvLoading = true;
    this.exportService.exportCSV(this.csvGroupe || undefined).subscribe({
      next: (blob) => {
        this.downloadBlob(blob, 'presences-export.csv');
        this.notificationService.success('Export CSV téléchargé avec succès');
        this.csvLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.notificationService.error("Erreur lors de l'export CSV");
        this.csvLoading = false;
        this.cdr.markForCheck();
      },
    });
  }

  downloadPDF(): void {
    this.pdfLoading = true;
    this.exportService.exportPDF(this.pdfGroupe || undefined).subscribe({
      next: (blob) => {
        this.downloadBlob(blob, 'presences-export.pdf');
        this.notificationService.success('Export PDF téléchargé avec succès');
        this.pdfLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.notificationService.error("Erreur lors de l'export PDF");
        this.pdfLoading = false;
        this.cdr.markForCheck();
      },
    });
  }

  private downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
}
