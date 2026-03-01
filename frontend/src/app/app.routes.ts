import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { MonPfeComponent } from './features/mon-pfe/mon-pfe.component';
import { GestionPresencesComponent } from './features/gestion-presences/gestion-presences.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { Role } from './core/models/user.model';
import { StatistiquesComponent } from './features/statistiques/statistiques.component';
import { ScannerComponent } from './features/scanner/scanner.component';
import { MesPresencesComponent } from './features/mes-presences/mes-presences.component';
import { MesJustificatifsComponent } from './features/mes-justificatifs/mes-justificatifs.component';
import { SujetsComponent } from './features/sujets/sujets.component';
import { MesCandidaturesComponent } from './features/mes-candidatures/mes-candidatures.component';
import { MesSeancesComponent } from './features/mes-seances/mes-seances.component';
import { JustificatifsValidationComponent } from './features/justificatifs-validation/justificatifs-validation.component';
import { MesSujetsComponent } from './features/mes-sujets/mes-sujets.component';
import { MesEncadrementsComponent } from './features/mes-encadrements/mes-encadrements.component';
import { SujetsValidationComponent } from './features/sujets-validation/sujets-validation.component';
import { AffectationsComponent } from './features/affectations/affectations.component';
import { CandidaturesGestionComponent } from './features/candidatures-gestion/candidatures-gestion.component';
import { ExportsComponent } from './features/exports/exports.component';
import { SoutenancesComponent } from './features/soutenances/soutenances.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },

      { path: 'scanner', component: ScannerComponent, canActivate: [authGuard, roleGuard], data: { roles: [Role.ETUDIANT] } },
      { path: 'mes-presences', component: MesPresencesComponent, canActivate: [authGuard, roleGuard], data: { roles: [Role.ETUDIANT] } },
      { path: 'mes-justificatifs', component: MesJustificatifsComponent, canActivate: [authGuard, roleGuard], data: { roles: [Role.ETUDIANT] } },
      { path: 'sujets', component: SujetsComponent, canActivate: [authGuard, roleGuard], data: { roles: [Role.ETUDIANT] } },
      { path: 'mes-candidatures', component: MesCandidaturesComponent, canActivate: [authGuard, roleGuard], data: { roles: [Role.ETUDIANT] } },
      { path: 'mon-pfe', component: MonPfeComponent, canActivate: [authGuard, roleGuard], data: { roles: [Role.ETUDIANT] } },

      { path: 'mes-seances', component: MesSeancesComponent, canActivate: [authGuard, roleGuard], data: { roles: [Role.ENSEIGNANT] } },
      { path: 'gestion-presences', component: GestionPresencesComponent, canActivate: [authGuard, roleGuard], data: { roles: [Role.ENSEIGNANT] } },
      { path: 'justificatifs', component: JustificatifsValidationComponent, canActivate: [authGuard, roleGuard], data: { roles: [Role.ENSEIGNANT] } },
      { path: 'mes-sujets', component: MesSujetsComponent, canActivate: [authGuard, roleGuard], data: { roles: [Role.ENSEIGNANT] } },
      { path: 'mes-encadrements', component: MesEncadrementsComponent, canActivate: [authGuard, roleGuard], data: { roles: [Role.ENSEIGNANT] } },

      { path: 'sujets-validation', component: SujetsValidationComponent, canActivate: [authGuard, roleGuard], data: { roles: [Role.RESPONSABLE_PFE] } },
      { path: 'affectations', component: AffectationsComponent, canActivate: [authGuard, roleGuard], data: { roles: [Role.RESPONSABLE_PFE] } },
      { path: 'candidatures', component: CandidaturesGestionComponent, canActivate: [authGuard, roleGuard], data: { roles: [Role.RESPONSABLE_PFE] } },
      { path: 'statistiques', component: StatistiquesComponent, canActivate: [authGuard, roleGuard], data: { roles: [Role.ENSEIGNANT, Role.RESPONSABLE_PFE] } },
      { path: 'exports', component: ExportsComponent, canActivate: [authGuard, roleGuard], data: { roles: [Role.ENSEIGNANT, Role.RESPONSABLE_PFE] } },
      { path: 'soutenances', component: SoutenancesComponent, canActivate: [authGuard, roleGuard], data: { roles: [Role.RESPONSABLE_PFE] } },
    ],
  },

  { path: '**', redirectTo: '/dashboard' },
];
