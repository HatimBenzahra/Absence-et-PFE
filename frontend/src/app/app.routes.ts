import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { SujetsListComponent } from './features/projets/sujets-list/sujets-list.component';
import { SujetDetailComponent } from './features/projets/sujet-detail/sujet-detail.component';
import { MesCandidaturesComponent } from './features/projets/mes-candidatures/mes-candidatures.component';
import { MonPfeComponent } from './features/projets/mon-pfe/mon-pfe.component';
import { MesSeancesComponent } from './features/presences/mes-seances/mes-seances.component';
import { PointageQrComponent } from './features/presences/pointage-qr/pointage-qr.component';
import { MesPresencesComponent } from './features/presences/mes-presences/mes-presences.component';
import { JustificatifsComponent } from './features/presences/justificatifs/justificatifs.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  {
    path: 'projets',
    canActivate: [authGuard],
    children: [
      { path: 'sujets', component: SujetsListComponent },
      { path: 'sujets/:id', component: SujetDetailComponent },
      { path: 'mes-candidatures', component: MesCandidaturesComponent },
      { path: 'mon-pfe', component: MonPfeComponent }
    ]
  },
  {
    path: 'presences',
    canActivate: [authGuard],
    children: [
      { path: 'mes-seances', component: MesSeancesComponent },
      { path: 'pointage', component: PointageQrComponent },
      { path: 'historique', component: MesPresencesComponent },
      { path: 'justificatifs', component: JustificatifsComponent }
    ]
  }
];
