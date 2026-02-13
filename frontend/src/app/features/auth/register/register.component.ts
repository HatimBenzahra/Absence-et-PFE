import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../shared/material.module';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MaterialModule],
  template: `
    <div class="register-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Inscription Étudiant</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="fill" class="full-width">
              <mat-label>Nom</mat-label>
              <input matInput formControlName="nom">
            </mat-form-field>

            <mat-form-field appearance="fill" class="full-width">
              <mat-label>Prénom</mat-label>
              <input matInput formControlName="prenom">
            </mat-form-field>

            <mat-form-field appearance="fill" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" type="email">
            </mat-form-field>

            <mat-form-field appearance="fill" class="full-width">
              <mat-label>Mot de passe</mat-label>
              <input matInput formControlName="motDePasse" type="password">
            </mat-form-field>

            <mat-form-field appearance="fill" class="full-width">
              <mat-label>Numéro Étudiant</mat-label>
              <input matInput formControlName="numEtudiant">
            </mat-form-field>

            <mat-form-field appearance="fill" class="full-width">
              <mat-label>Groupe</mat-label>
              <input matInput formControlName="groupe">
            </mat-form-field>

            <mat-form-field appearance="fill" class="full-width">
              <mat-label>Filière</mat-label>
              <input matInput formControlName="filiere">
            </mat-form-field>

            <button mat-raised-button color="primary" type="submit" [disabled]="registerForm.invalid || loading">
              {{ loading ? 'Inscription...' : 'S\'inscrire' }}
            </button>
          </form>
        </mat-card-content>
        <mat-card-actions>
          <a mat-button routerLink="/login">Déjà un compte ? Se connecter</a>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .register-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: #f5f5f5;
      padding: 20px;
    }
    mat-card {
      max-width: 500px;
      width: 100%;
      padding: 20px;
    }
    .full-width {
      width: 100%;
      margin-bottom: 10px;
    }
    button[type="submit"] {
      width: 100%;
    }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
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

  onSubmit() {
    if (this.registerForm.valid) {
      this.loading = true;
      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.loading = false;
          console.error('Registration failed', err);
        }
      });
    }
  }
}
