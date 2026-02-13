import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../../shared/material.module';
import { PresenceService } from '../../../core/services/presence.service';
import { PointageRequest } from '../../../core/models/presence.model';

@Component({
  selector: 'app-pointage-qr',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule],
  template: `
    <div class="pointage-container">
      <h2>Scanner QR Code</h2>
      <mat-card>
        <mat-card-content>
          <p>Pour pointer, veuillez scanner le QR code affiché par l'enseignant.</p>
          <mat-form-field appearance="fill" class="full-width">
            <mat-label>Token QR Code</mat-label>
            <input matInput [(ngModel)]="qrToken" placeholder="Entrez le token manuellement si besoin">
          </mat-form-field>
          <button mat-raised-button color="primary" (click)="pointer()" [disabled]="!qrToken">Valider Pointage</button>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .pointage-container {
      padding: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    mat-card {
      max-width: 400px;
      width: 100%;
    }
    .full-width {
      width: 100%;
      margin-bottom: 15px;
    }
  `]
})
export class PointageQrComponent {
  qrToken: string = '';

  constructor(private presenceService: PresenceService) {}

  pointer() {
    if (this.qrToken) {
      const request: PointageRequest = { qrToken: this.qrToken };
      this.presenceService.pointer(request).subscribe({
        next: () => {
          alert('Pointage réussi !');
          this.qrToken = '';
        },
        error: (err) => {
          alert('Erreur lors du pointage : ' + err.message);
        }
      });
    }
  }
}
