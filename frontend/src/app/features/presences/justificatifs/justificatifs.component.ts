import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../shared/material.module';

@Component({
  selector: 'app-justificatifs',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  template: `
    <div class="justificatifs-container">
      <h2>Mes Justificatifs</h2>
      <mat-card>
        <mat-card-content>
          <p>Fonctionnalité de dépôt de justificatifs à venir.</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .justificatifs-container {
      padding: 20px;
    }
  `]
})
export class JustificatifsComponent {}
