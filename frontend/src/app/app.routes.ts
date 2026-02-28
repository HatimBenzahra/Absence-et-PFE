import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { SpacePlaceholderComponent } from './features/placeholder/space-placeholder.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { authGuard } from './core/guards/auth.guard';

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

      { path: 'scanner', component: SpacePlaceholderComponent, data: { title: 'Scanner QR', description: 'Pointage des presences etudiantes par QR code.' } },
      { path: 'mes-presences', component: SpacePlaceholderComponent, data: { title: 'Mes presences', description: 'Historique de presence avec filtres et synthese.' } },
      { path: 'mes-justificatifs', component: SpacePlaceholderComponent, data: { title: 'Mes justificatifs', description: 'Depot et suivi de validation des justificatifs.' } },
      { path: 'sujets', component: SpacePlaceholderComponent, data: { title: 'Sujets PFE', description: 'Catalogue des sujets disponibles pour candidature.' } },
      { path: 'mes-candidatures', component: SpacePlaceholderComponent, data: { title: 'Mes candidatures', description: 'Suivi des candidatures deposees sur les sujets PFE.' } },
      { path: 'mon-pfe', component: SpacePlaceholderComponent, data: { title: 'Mon PFE', description: 'Vue globale de votre affectation et livrables.' } },

      { path: 'mes-seances', component: SpacePlaceholderComponent, data: { title: 'Mes seances', description: 'Planification et gestion des seances enseignant.' } },
      { path: 'gestion-presences', component: SpacePlaceholderComponent, data: { title: 'Gestion presences', description: 'Saisie manuelle et controle des presences.' } },
      { path: 'justificatifs', component: SpacePlaceholderComponent, data: { title: 'Justificatifs', description: 'Validation ou refus des justificatifs recus.' } },
      { path: 'mes-sujets', component: SpacePlaceholderComponent, data: { title: 'Mes sujets', description: 'Gestion des sujets proposes par l enseignant.' } },
      { path: 'mes-encadrements', component: SpacePlaceholderComponent, data: { title: 'Mes encadrements', description: 'Suivi des etudiants affectes en encadrement.' } },

      { path: 'sujets-validation', component: SpacePlaceholderComponent, data: { title: 'Validation sujets', description: 'Validation responsable des sujets soumis.' } },
      { path: 'affectations', component: SpacePlaceholderComponent, data: { title: 'Affectations', description: 'Affectation manuelle ou automatique des PFE.' } },
      { path: 'candidatures', component: SpacePlaceholderComponent, data: { title: 'Candidatures', description: 'Lecture et arbitrage des candidatures etudiantes.' } },
      { path: 'statistiques', component: SpacePlaceholderComponent, data: { title: 'Statistiques', description: 'Indicateurs de suivi des presences et PFE.' } },
      { path: 'exports', component: SpacePlaceholderComponent, data: { title: 'Exports', description: 'Export des donnees de suivi en CSV ou PDF.' } },
    ],
  },

  { path: '**', redirectTo: '/dashboard' },
];
