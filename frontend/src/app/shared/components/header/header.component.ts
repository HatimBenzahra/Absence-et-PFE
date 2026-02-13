import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../material.module';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule],
  template: `
    <mat-toolbar color="primary">
      <button mat-icon-button (click)="toggleSidenav.emit()">
        <mat-icon>menu</mat-icon>
      </button>
      <span>ISTY PFE & Présences</span>
      <span class="spacer"></span>
      <ng-container *ngIf="authService.currentUser$ | async as user">
        <button mat-button>
          {{ user.prenom }} {{ user.nom }}
        </button>
        <button mat-icon-button (click)="logout()">
          <mat-icon>logout</mat-icon>
        </button>
      </ng-container>
    </mat-toolbar>
  `,
  styles: [`
    .spacer {
      flex: 1 1 auto;
    }
  `]
})
export class HeaderComponent {
  @Output() toggleSidenav = new EventEmitter<void>();

  constructor(public authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}
