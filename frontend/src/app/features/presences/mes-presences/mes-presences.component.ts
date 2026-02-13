import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../shared/material.module';
import { PresenceService } from '../../../core/services/presence.service';
import { Presence } from '../../../core/models/presence.model';

@Component({
  selector: 'app-mes-presences',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  template: `
    <div class="presences-container">
      <h2>Historique des Présences</h2>
      <table mat-table [dataSource]="presences" class="mat-elevation-z8">
        <ng-container matColumnDef="seance">
          <th mat-header-cell *matHeaderCellDef> Séance </th>
          <td mat-cell *matCellDef="let element"> {{element.seanceId}} </td>
        </ng-container>

        <ng-container matColumnDef="statut">
          <th mat-header-cell *matHeaderCellDef> Statut </th>
          <td mat-cell *matCellDef="let element"> {{element.statut}} </td>
        </ng-container>

        <ng-container matColumnDef="date">
          <th mat-header-cell *matHeaderCellDef> Date Pointage </th>
          <td mat-cell *matCellDef="let element"> {{element.datePointage | date:'short'}} </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
    </div>
  `,
  styles: [`
    .presences-container {
      padding: 20px;
    }
    table {
      width: 100%;
    }
  `]
})
export class MesPresencesComponent implements OnInit {
  displayedColumns: string[] = ['seance', 'statut', 'date'];
  presences: Presence[] = [];

  constructor(private presenceService: PresenceService) {}

  ngOnInit() {
    this.presenceService.getMyPresences().subscribe(data => {
      this.presences = data;
    });
  }
}
