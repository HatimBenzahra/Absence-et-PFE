import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../shared/material.module';
import { AuthService } from '../../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MaterialModule],
  template: `
    <div class="auth-container">
      <!-- Left panel - Branding -->
      <div class="branding-panel">
        <div class="branding-content">
          <div class="logo">ISTY</div>
          <h1>Rejoignez la plateforme</h1>
          <p>Créez votre compte étudiant pour accéder à vos cours, notes et projets.</p>
        </div>
      </div>

      <!-- Right panel - Form -->
      <div class="form-panel">
        <div class="auth-card glass-card register-card">
          <div class="auth-header">
            <h2>Inscription</h2>
            <p class="subtitle">Créez votre compte étudiant</p>
          </div>
          
          <!-- Stepper Header -->
          <div class="stepper-container">
            <div class="step" [class.active]="currentStep >= 1" [class.completed]="currentStep > 1" (click)="goToStep(1)">
              <div class="step-circle">1</div>
              <div class="step-label">Infos</div>
            </div>
            <div class="step" [class.active]="currentStep >= 2" [class.completed]="currentStep > 2" (click)="goToStep(2)">
              <div class="step-circle">2</div>
              <div class="step-label">Études</div>
            </div>
            <div class="step" [class.active]="currentStep >= 3" [class.completed]="currentStep > 3" (click)="goToStep(3)">
              <div class="step-circle">3</div>
              <div class="step-label">Compte</div>
            </div>
          </div>

          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="auth-form">
            
            <!-- Step 1: Informations Personnelles -->
            <div *ngIf="currentStep === 1" class="form-step fade-in">
              <div class="form-row">
                <mat-form-field appearance="outline" class="modern-input">
                  <mat-label>Nom</mat-label>
                  <input matInput formControlName="nom" placeholder="Votre nom">
                  <mat-error *ngIf="registerForm.get('nom')?.hasError('required')">Requis</mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline" class="modern-input">
                  <mat-label>Prénom</mat-label>
                  <input matInput formControlName="prenom" placeholder="Votre prénom">
                  <mat-error *ngIf="registerForm.get('prenom')?.hasError('required')">Requis</mat-error>
                </mat-form-field>
              </div>
              
              <button type="button" class="btn-gradient" (click)="nextStep()">
                Suivant
              </button>
            </div>

            <!-- Step 2: Informations Académiques -->
            <div *ngIf="currentStep === 2" class="form-step fade-in">
              <div class="form-row">
                <mat-form-field appearance="outline" class="modern-input">
                  <mat-label>Numéro Étudiant</mat-label>
                  <input matInput formControlName="numEtudiant" placeholder="Ex. 20230001">
                  <mat-error *ngIf="registerForm.get('numEtudiant')?.hasError('required')">Requis</mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline" class="modern-input">
                  <mat-label>Groupe</mat-label>
                  <input matInput formControlName="groupe" placeholder="Ex. G1">
                  <mat-error *ngIf="registerForm.get('groupe')?.hasError('required')">Requis</mat-error>
                </mat-form-field>
              </div>
              
              <mat-form-field appearance="outline" class="modern-input full-width">
                <mat-label>Filière</mat-label>
                <input matInput formControlName="filiere" placeholder="Ex. Informatique">
                <mat-error *ngIf="registerForm.get('filiere')?.hasError('required')">Requis</mat-error>
              </mat-form-field>

              <div class="flex gap-4" style="display: flex; gap: 16px;">
                <button type="button" mat-stroked-button (click)="prevStep()" style="flex: 1; height: 56px; border-radius: 12px;">Précédent</button>
                <button type="button" class="btn-gradient" (click)="nextStep()" style="margin-top: 0; flex: 1;">Suivant</button>
              </div>
            </div>

            <!-- Step 3: Compte -->
            <div *ngIf="currentStep === 3" class="form-step fade-in">
              <mat-form-field appearance="outline" class="modern-input full-width">
                <mat-label>Email</mat-label>
                <mat-icon matPrefix>email</mat-icon>
                <input matInput formControlName="email" type="email" placeholder="Ex. etudiant@isty.fr">
                <mat-error *ngIf="registerForm.get('email')?.hasError('email')">Email invalide</mat-error>
                <mat-error *ngIf="registerForm.get('email')?.hasError('required')">Requis</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="modern-input full-width">
                <mat-label>Mot de passe</mat-label>
                <mat-icon matPrefix>lock</mat-icon>
                <input matInput formControlName="motDePasse" [type]="hidePassword ? 'password' : 'text'" (input)="checkPasswordStrength()">
                <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword" type="button">
                  <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
                </button>
                <mat-error *ngIf="registerForm.get('motDePasse')?.hasError('required')">Requis</mat-error>
                <mat-error *ngIf="registerForm.get('motDePasse')?.hasError('minlength')">Min 6 caractères</mat-error>
              </mat-form-field>
              
              <div class="password-strength" *ngIf="passwordStrengthClass">
                <div class="strength-bar" [ngClass]="passwordStrengthClass"></div>
              </div>

              <div class="flex gap-4" style="display: flex; gap: 16px;">
                <button type="button" mat-stroked-button (click)="prevStep()" style="flex: 1; height: 56px; border-radius: 12px;">Précédent</button>
                <button type="submit" class="btn-gradient" [disabled]="registerForm.invalid || loading" style="margin-top: 0; flex: 1;">
                  <mat-spinner diameter="20" *ngIf="loading" style="display:inline-block; margin-right: 8px; color: white;"></mat-spinner>
                  {{ loading ? 'Inscription...' : 'S\'inscrire' }}
                </button>
              </div>
            </div>
            
            <div class="auth-links center" style="margin-top: 24px; text-align: center;">
              <span style="color: #64748b;">Déjà un compte ? </span>
              <a routerLink="/login" style="color: #1565c0; font-weight: 600; margin-left: 4px;">Se connecter</a>
            </div>
          </form>
          
          <div class="auth-footer">
            &copy; {{ currentYear }} ISTY. Tous droits réservés.
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;
  hidePassword = true;
  passwordStrengthClass = '';
  currentStep = 1;
  currentYear = new Date().getFullYear();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      motDePasse: ['', [Validators.required, Validators.minLength(6)]],
      numEtudiant: ['', Validators.required],
      groupe: ['', Validators.required],
      filiere: ['', Validators.required]
    });
  }

  checkPasswordStrength() {
    const password = this.registerForm.get('motDePasse')?.value;
    if (!password) {
      this.passwordStrengthClass = '';
      return;
    }
    if (password.length < 6) {
      this.passwordStrengthClass = 'weak';
    } else if (password.length < 10) {
      this.passwordStrengthClass = 'medium';
    } else {
      this.passwordStrengthClass = 'strong';
    }
  }

  nextStep() {
    if (this.currentStep === 1) {
      if (this.registerForm.get('nom')?.valid && this.registerForm.get('prenom')?.valid) {
        this.currentStep++;
      } else {
        this.registerForm.get('nom')?.markAsTouched();
        this.registerForm.get('prenom')?.markAsTouched();
      }
    } else if (this.currentStep === 2) {
      if (this.registerForm.get('numEtudiant')?.valid && this.registerForm.get('groupe')?.valid && this.registerForm.get('filiere')?.valid) {
        this.currentStep++;
      } else {
        this.registerForm.get('numEtudiant')?.markAsTouched();
        this.registerForm.get('groupe')?.markAsTouched();
        this.registerForm.get('filiere')?.markAsTouched();
      }
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  goToStep(step: number) {
    if (step < this.currentStep) {
      this.currentStep = step;
    }
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.loading = true;
      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          this.snackBar.open('Inscription réussie !', 'Fermer', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.loading = false;
          console.error('Registration failed', err);
          this.snackBar.open('Erreur lors de l\'inscription', 'Fermer', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}
