import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialModule } from '../../../shared/material.module';
import { SujetService } from '../../../core/services/sujet.service';
import { CandidatureService } from '../../../core/services/candidature.service';
import { Sujet } from '../../../core/models/sujet.model';
import { CandidatureCreate } from '../../../core/models/candidature.model';

@Component({
  selector: 'app-sujet-detail',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  template: `
    <div class="sujet-detail-container" *ngIf="sujet">
      <mat-card>
        <mat-card-header>
          <mat-card-title>{{ sujet.titre }}</mat-card-title>
          <mat-card-subtitle>{{ sujet.enseignantNom }}</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <p><strong>Description:</strong> {{ sujet.description }}</p>
          <p><strong>Mots-clés:</strong> {{ sujet.motsCles }}</p>
          <p><strong>Statut:</strong> {{ sujet.statut }}</p>
        </mat-card-content>
        <mat-card-actions>
          <button mat-raised-button color="primary" (click)="candidater()">Candidater</button>
          <button mat-button (click)="goBack()">Retour</button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .sujet-detail-container {
      padding: 20px;
      display: flex;
      justify-content: center;
    }
    mat-card {
      max-width: 800px;
      width: 100%;
    }
  `]
})
export class SujetDetailComponent implements OnInit {
  sujet: Sujet | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sujetService: SujetService,
    private candidatureService: CandidatureService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.sujetService.getById(id).subscribe(sujet => {
        this.sujet = sujet;
      });
    }
  }

  candidater() {
    if (this.sujet) {
      const candidature: CandidatureCreate = {
        sujetId: this.sujet.id,
        rangPreference: 1,
        motivation: 'Je suis très intéressé par ce sujet.'
      };
      this.candidatureService.create(candidature).subscribe(() => {
        alert('Candidature envoyée avec succès !');
        this.router.navigate(['/projets/mes-candidatures']);
      });
    }
  }

  goBack() {
    this.router.navigate(['/projets/sujets']);
  }
}
