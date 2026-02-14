import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../shared/material.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AuthService } from '../../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MaterialModule, MatCheckboxModule],
  template: `
    <div class="auth-container">
      <!-- Left panel - Branding -->
      <div class="branding-panel">
        <div class="branding-content">
          <div class="logo">ISTY</div>
          <h1>Gestion PFE & Présences</h1>
          <p>Plateforme de suivi académique et de gestion des projets de fin d'études.</p>
        </div>
      </div>
      
      <!-- Right panel - Form -->
      <div class="form-panel">
        <div class="auth-card glass-card">
          <div class="auth-header">
            <h2>Bienvenue</h2>
            <p class="subtitle">Connectez-vous à votre espace</p>
          </div>
          
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="auth-form">
            <mat-form-field appearance="outline" class="modern-input">
              <mat-label>Email</mat-label>
              <mat-icon matPrefix>email</mat-icon>
              <input matInput formControlName="email" type="email" placeholder="Ex. etudiant@isty.fr">
              <mat-error *ngIf="loginForm.get('email')?.hasError('email')">
                Email invalide
              </mat-error>
              <mat-error *ngIf="loginForm.get('email')?.hasError('required')">
                L'email est requis
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="modern-input">
              <mat-label>Mot de passe</mat-label>
              <mat-icon matPrefix>lock</mat-icon>
              <input matInput formControlName="motDePasse" [type]="hidePassword ? 'password' : 'text'">
              <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword" type="button">
                <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
              </button>
              <mat-error *ngIf="loginForm.get('motDePasse')?.hasError('required')">
                Le mot de passe est requis
              </mat-error>
            </mat-form-field>

            <div class="flex justify-between items-center" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <mat-checkbox color="primary">Se souvenir de moi</mat-checkbox>
              <a routerLink="/forgot-password" style="font-size: 14px; color: #64748b; text-decoration: none;">Mot de passe oublié ?</a>
            </div>

            <button class="btn-gradient" type="submit" [disabled]="loginForm.invalid || loading">
              <mat-spinner diameter="20" *ngIf="loading" style="display:inline-block; margin-right: 8px; color: white;"></mat-spinner>
              {{ loading ? 'Connexion...' : 'Se connecter' }}
            </button>
            
            <div class="auth-links center" style="margin-top: 24px; text-align: center;">
              <span style="color: #64748b;">Pas encore de compte ? </span>
              <a routerLink="/register" style="color: #1565c0; font-weight: 600; margin-left: 4px;">Créer un compte</a>
            </div>
          </form>
          
          <div class="auth-footer">
            &copy; {{ currentYear }} ISTY. Tous droits réservés.
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  hidePassword = true;
  currentYear = new Date().getFullYear();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      motDePasse: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.snackBar.open('Connexion réussie !', 'Fermer', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.loading = false;
          console.error('Login failed', err);
          this.snackBar.open('Email ou mot de passe incorrect', 'Fermer', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }
}
