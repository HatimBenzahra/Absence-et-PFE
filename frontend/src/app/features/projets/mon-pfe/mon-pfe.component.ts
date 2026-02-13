import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../shared/material.module';

@Component({
  selector: 'app-mon-pfe',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  template: `
    <div class="mon-pfe-container">
      <h2>Mon PFE</h2>
      <mat-card>
        <mat-card-content>
          <p>Vous n'avez pas encore de sujet PFE affecté.</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .mon-pfe-container {
      padding: 20px;
    }
  `]
})
export class MonPfeComponent implements OnInit {
  constructor() {}

  ngOnInit() {
  }
}
