import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { Role, User } from '../../core/models/user.model';
import { AdminService } from '../../core/services/admin.service';
import { NotificationService } from '../../shared/services/notification.service';

@Component({
  selector: 'app-gestion-utilisateurs',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatChipsModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  templateUrl: './gestion-utilisateurs.component.html',
  styleUrl: './gestion-utilisateurs.component.scss',
})
export class GestionUtilisateursComponent implements OnInit {
  private cdr = inject(ChangeDetectorRef);
  utilisateurs: User[] = [];
  loading = true;
  actionLoading = new Set<string>();
  displayedColumns = ['nom', 'prenom', 'email', 'role', 'actions'];
  roleOptions = [Role.ETUDIANT, Role.ENSEIGNANT, Role.RESPONSABLE_PFE, Role.SECRETARIAT, Role.ADMIN];

  constructor(
    private adminService: AdminService,
    private notification: NotificationService,
  ) {}

  ngOnInit(): void {
    this.loadUtilisateurs();
  }

  loadUtilisateurs(): void {
    this.loading = true;
    this.adminService.getAllUtilisateurs().subscribe({
      next: (data) => {
        this.utilisateurs = data;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.notification.error('Impossible de charger les utilisateurs.');
        this.loading = false;
        this.cdr.markForCheck();
      },
    });
  }

  onRoleChange(user: User, role: Role): void {
    if (role === user.role) {
      return;
    }

    const key = `role-${user.id}`;
    this.actionLoading.add(key);

    this.adminService.updateRole(user.id, role).subscribe({
      next: (updated) => {
        this.actionLoading.delete(key);
        this.utilisateurs = this.utilisateurs.map((u) => (u.id === user.id ? updated : u));
        this.notification.success(`Rôle mis à jour pour ${user.prenom} ${user.nom}.`);
        this.cdr.markForCheck();
      },
      error: () => {
        this.actionLoading.delete(key);
        this.notification.error('Impossible de mettre à jour le rôle.');
        this.cdr.markForCheck();
      },
    });
  }

  deleteUtilisateur(user: User): void {
    if (!window.confirm(`Supprimer le compte de ${user.prenom} ${user.nom} ?`)) {
      return;
    }

    const key = `delete-${user.id}`;
    this.actionLoading.add(key);

    this.adminService.deleteUtilisateur(user.id).subscribe({
      next: () => {
        this.actionLoading.delete(key);
        this.utilisateurs = this.utilisateurs.filter((u) => u.id !== user.id);
        this.notification.success(`Utilisateur ${user.prenom} ${user.nom} supprimé.`);
        this.cdr.markForCheck();
      },
      error: () => {
        this.actionLoading.delete(key);
        this.notification.error('Suppression impossible.');
        this.cdr.markForCheck();
      },
    });
  }

  isActionLoading(id: number, action: 'role' | 'delete'): boolean {
    return this.actionLoading.has(`${action}-${id}`);
  }

  roleLabel(role: Role): string {
    const labels: Record<Role, string> = {
      [Role.ETUDIANT]: 'Etudiant',
      [Role.ENSEIGNANT]: 'Enseignant',
      [Role.RESPONSABLE_PFE]: 'Responsable PFE',
      [Role.SECRETARIAT]: 'Secretariat',
      [Role.ADMIN]: 'Administrateur',
    };

    return labels[role] ?? role;
  }

  roleClass(role: Role): string {
    const classes: Record<Role, string> = {
      [Role.ETUDIANT]: 'chip--etudiant',
      [Role.ENSEIGNANT]: 'chip--enseignant',
      [Role.RESPONSABLE_PFE]: 'chip--responsable',
      [Role.SECRETARIAT]: 'chip--secretariat',
      [Role.ADMIN]: 'chip--admin',
    };

    return classes[role] ?? '';
  }
}
