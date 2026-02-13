import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  template: `
    <div class="loading-container" *ngIf="isLoading">
      <mat-spinner diameter="50"></mat-spinner>
      <p *ngIf="message">{{ message }}</p>
    </div>
  `,
  styles: [`
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
  `]
})
export class LoadingComponent {
  @Input() isLoading = false;
  @Input() message = 'Chargement...';
}
