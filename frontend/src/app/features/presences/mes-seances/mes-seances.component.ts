import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../shared/material.module';
import { SeanceService } from '../../../core/services/seance.service';
import { Seance } from '../../../core/models/seance.model';
import { QRCodeComponent } from 'angularx-qrcode';

@Component({
  selector: 'app-mes-seances',
  standalone: true,
  imports: [CommonModule, MaterialModule, QRCodeComponent],
  template: `
    <div class="seances-container">
      <h2>Mes Séances</h2>
      <div class="seances-list">
        <mat-card *ngFor="let seance of seances" class="seance-card">
          <mat-card-header>
            <mat-card-title>{{ seance.matiere }}</mat-card-title>
            <mat-card-subtitle>{{ seance.type }} - {{ seance.salle }}</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p>Début: {{ seance.dateDebut | date:'short' }}</p>
            <p>Fin: {{ seance.dateFin | date:'short' }}</p>
            <div *ngIf="qrCodes[seance.id]" class="qr-code-container">
              <qrcode [qrdata]="qrCodes[seance.id]" [width]="200" [errorCorrectionLevel]="'M'"></qrcode>
            </div>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="primary" (click)="generateQr(seance.id)">Générer QR Code</button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .seances-container {
      padding: 20px;
    }
    .seances-list {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
    }
    .seance-card {
      width: 300px;
    }
    .qr-code-container {
      display: flex;
      justify-content: center;
      margin-top: 10px;
    }
  `]
})
export class MesSeancesComponent implements OnInit {
  seances: Seance[] = [];
  qrCodes: { [key: number]: string } = {};

  constructor(private seanceService: SeanceService) {}

  ngOnInit() {
    this.seanceService.getMySeances().subscribe(data => {
      this.seances = data;
    });
  }

  generateQr(seanceId: number) {
    this.seanceService.generateQrCode(seanceId).subscribe(response => {
      this.qrCodes[seanceId] = response.token;
    });
  }
}
