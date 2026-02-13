import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../shared/material.module';
import { CandidatureService } from '../../../core/services/candidature.service';
import { Candidature } from '../../../core/models/candidature.model';

@Component({
  selector: 'app-mes-candidatures',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  template: `
    <div class="candidatures-container">
      <h2>Mes Candidatures</h2>
      <table mat-table [dataSource]="candidatures" class="mat-elevation-z8">
        <ng-container matColumnDef="sujet">
          <th mat-header-cell *matHeaderCellDef> Sujet </th>
          <td mat-cell *matCellDef="let element"> {{element.sujetTitre}} </td>
        </ng-container>

        <ng-container matColumnDef="preference">
          <th mat-header-cell *matHeaderCellDef> Préférence </th>
          <td mat-cell *matCellDef="let element"> {{element.rangPreference}} </td>
        </ng-container>

        <ng-container matColumnDef="statut">
          <th mat-header-cell *matHeaderCellDef> Statut </th>
          <td mat-cell *matCellDef="let element"> {{element.statut}} </td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef> Actions </th>
          <td mat-cell *matCellDef="let element">
            <button mat-icon-button color="warn" (click)="deleteCandidature(element.id)">
              <mat-icon>delete</mat-icon>
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
    </div>
  `,
  styles: [`
    .candidatures-container {
      padding: 20px;
    }
    table {
      width: 100%;
    }
  `]
})
export class MesCandidaturesComponent implements OnInit {
  displayedColumns: string[] = ['sujet', 'preference', 'statut', 'actions'];
  candidatures: Candidature[] = [];

  constructor(private candidatureService: CandidatureService) {}

  ngOnInit() {
    this.loadCandidatures();
  }

  loadCandidatures() {
    this.candidatureService.getMyCandidatures().subscribe(data => {
      this.candidatures = data;
    });
  }

  deleteCandidature(id: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette candidature ?')) {
      this.candidatureService.delete(id).subscribe(() => {
        this.loadCandidatures();
      });
    }
  }
}
