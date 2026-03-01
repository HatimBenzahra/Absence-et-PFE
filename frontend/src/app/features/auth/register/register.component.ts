import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatStepperModule } from '@angular/material/stepper';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { Role } from '../../../core/models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatStepperModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  private cdr = inject(ChangeDetectorRef);
  infoForm: FormGroup;
  roleForm: FormGroup;
  accountForm: FormGroup;
  loading = false;
  hidePassword = true;

  roles = [
    { value: Role.ETUDIANT, label: 'Étudiant' },
    { value: Role.ENSEIGNANT, label: 'Enseignant' },
    { value: Role.RESPONSABLE_PFE, label: 'Responsable PFE' },
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private notify: NotificationService,
  ) {
    this.infoForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      role: [Role.ETUDIANT, Validators.required],
    });

    this.roleForm = this.fb.group({});
    this.buildRoleFields(Role.ETUDIANT);

    this.accountForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      motDePasse: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get selectedRole(): Role {
    return this.infoForm.get('role')?.value;
  }

  onRoleChange(): void {
    this.buildRoleFields(this.selectedRole);
    this.cdr.markForCheck();
  }

  private buildRoleFields(role: Role): void {
    if (role === Role.ETUDIANT) {
      this.roleForm = this.fb.group({
        numEtudiant: ['', Validators.required],
        groupe: ['', Validators.required],
        filiere: ['', Validators.required],
      });
    } else if (role === Role.ENSEIGNANT) {
      this.roleForm = this.fb.group({
        departement: ['', Validators.required],
        grade: ['', Validators.required],
      });
    } else if (role === Role.RESPONSABLE_PFE) {
      this.roleForm = this.fb.group({
        fonction: ['', Validators.required],
      });
    }
  }

  onSubmit(): void {
    if (this.infoForm.invalid || this.roleForm.invalid || this.accountForm.invalid) return;

    this.loading = true;
    const data = {
      ...this.infoForm.value,
      ...this.roleForm.value,
      ...this.accountForm.value,
    };

    this.authService.register(data).subscribe({
      next: () => {
        this.notify.success('Inscription réussie !');
        this.router.navigate(['/login']);
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.cdr.markForCheck();
        this.notify.error("Erreur lors de l'inscription");
      },
    });
  }
}
