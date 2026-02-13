import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../shared/material.module';
import { SujetService } from '../../../core/services/sujet.service';
import { Sujet } from '../../../core/models/sujet.model';

@Component({
  selector: 'app-sujets-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule],
  template: `
    <div class="sujets-container">
      <h2>Liste des Sujets PFE</h2>
      <mat-form-field appearance="fill" class="search-field">
        <mat-label>Rechercher</mat-label>
        <input matInput (keyup)="applyFilter($event)" placeholder="Ex. Intelligence Artificielle">
      </mat-form-field>

      <table mat-table [dataSource]="dataSource" class="mat-elevation-z8">
        <ng-container matColumnDef="titre">
          <th mat-header-cell *matHeaderCellDef> Titre </th>
          <td mat-cell *matCellDef="let element"> {{element.titre}} </td>
        </ng-container>

        <ng-container matColumnDef="enseignant">
          <th mat-header-cell *matHeaderCellDef> Enseignant </th>
          <td mat-cell *matCellDef="let element"> {{element.enseignantNom}} </td>
        </ng-container>

        <ng-container matColumnDef="statut">
          <th mat-header-cell *matHeaderCellDef> Statut </th>
          <td mat-cell *matCellDef="let element"> {{element.statut}} </td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef> Actions </th>
          <td mat-cell *matCellDef="let element">
            <button mat-button color="primary" [routerLink]="['/projets/sujets', element.id]">Détails</button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
    </div>
  `,
  styles: [`
    .sujets-container {
      padding: 20px;
    }
    .search-field {
      width: 100%;
      margin-bottom: 20px;
    }
    table {
      width: 100%;
    }
  `]
})
export class SujetsListComponent implements OnInit {
  displayedColumns: string[] = ['titre', 'enseignant', 'statut', 'actions'];
  dataSource: Sujet[] = [];
  allSujets: Sujet[] = [];

  constructor(private sujetService: SujetService) {}

  ngOnInit() {
    this.sujetService.getAll().subscribe(sujets => {
      this.allSujets = sujets;
      this.dataSource = sujets;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.dataSource = this.allSujets.filter(sujet => 
      sujet.titre.toLowerCase().includes(filterValue) ||
      sujet.motsCles.toLowerCase().includes(filterValue)
    );
  }
}
