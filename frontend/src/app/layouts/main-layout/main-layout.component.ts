import { BreakpointObserver } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { Router, NavigationEnd, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { Role } from '../../core/models/user.model';
import { AuthService } from '../../core/services/auth.service';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent implements OnInit, OnDestroy {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  isMobile = false;
  navSections: NavSection[] = [];
  currentUser: ReturnType<AuthService['getCurrentUser']> = null;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private router: Router,
    private breakpointObserver: BreakpointObserver,
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.navSections = this.buildNavigation(this.currentUser?.role);

    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.currentUser = user;
        this.navSections = this.buildNavigation(user?.role);
      });

    this.breakpointObserver
      .observe(['(max-width: 1024px)'])
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        this.isMobile = result.matches;
      });

    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$),
      )
      .subscribe(() => {
        if (this.isMobile && this.sidenav) {
          this.sidenav.close();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleSidenav(): void {
    this.sidenav.toggle();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getRoleLabel(): string {
    const labels: Record<Role, string> = {
      [Role.ETUDIANT]: 'Etudiant',
      [Role.ENSEIGNANT]: 'Enseignant',
      [Role.RESPONSABLE_PFE]: 'Responsable PFE',
      [Role.SECRETARIAT]: 'Secretariat',
      [Role.ADMIN]: 'Administrateur',
    };

    const role = this.currentUser?.role;
    return role ? labels[role] : 'Utilisateur';
  }

  getInitials(): string {
    if (!this.currentUser) {
      return '??';
    }

    return `${this.currentUser.prenom[0]}${this.currentUser.nom[0]}`.toUpperCase();
  }

  private buildNavigation(role: Role | undefined): NavSection[] {
    const common: NavSection = {
      title: 'Principal',
      items: [{ label: 'Dashboard', icon: 'dashboard', route: '/dashboard' }],
    };

    const byRole: Record<Role, NavSection[]> = {
      [Role.ETUDIANT]: [
        {
          title: 'Presences',
          items: [
            { label: 'Emploi du temps', icon: 'calendar_month', route: '/emploi-du-temps-etudiant' },
            { label: 'Scanner QR', icon: 'qr_code_scanner', route: '/scanner' },
            { label: 'Mes presences', icon: 'fact_check', route: '/mes-presences' },
            { label: 'Mes justificatifs', icon: 'description', route: '/mes-justificatifs' },
          ],
        },
        {
          title: 'PFE',
          items: [
            { label: 'Sujets', icon: 'topic', route: '/sujets' },
            { label: 'Candidatures', icon: 'assignment_ind', route: '/mes-candidatures' },
            { label: 'Mon PFE', icon: 'school', route: '/mon-pfe' },
          ],
        },
      ],
      [Role.ENSEIGNANT]: [
        {
          title: 'Presences',
          items: [
            { label: 'Mes seances', icon: 'event', route: '/mes-seances' },
            { label: 'Gestion presences', icon: 'playlist_add_check', route: '/gestion-presences' },
            { label: 'Justificatifs', icon: 'rule', route: '/justificatifs' },
          ],
        },
        {
          title: 'PFE',
          items: [
            { label: 'Mes sujets', icon: 'menu_book', route: '/mes-sujets' },
            { label: 'Encadrements', icon: 'supervisor_account', route: '/mes-encadrements' },
          ],
        },
      ],
      [Role.RESPONSABLE_PFE]: [
        {
          title: 'Pilotage PFE',
          items: [
            { label: 'Validation sujets', icon: 'task_alt', route: '/sujets-validation' },
            { label: 'Affectations', icon: 'assignment', route: '/affectations' },
            { label: 'Candidatures', icon: 'groups', route: '/candidatures' },
          ],
        },
        {
          title: 'Suivi',
          items: [
            { label: 'Statistiques', icon: 'query_stats', route: '/statistiques' },
            { label: 'Exports', icon: 'download', route: '/exports' },
          ],
        },
      ],
      [Role.SECRETARIAT]: [
        {
          title: 'Gestion',
          items: [
            { label: 'Emploi du temps', icon: 'calendar_month', route: '/emploi-du-temps' },
            { label: 'Consultation profs', icon: 'groups', route: '/consultation-enseignants' },
            { label: 'Justificatifs', icon: 'fact_check', route: '/justificatifs-gestion' },
          ],
        },
        {
          title: 'Présences',
          items: [
            { label: 'Supervision', icon: 'visibility', route: '/supervision-presences' },
          ],
        },
        {
          title: 'Suivi',
          items: [
            { label: 'Statistiques', icon: 'query_stats', route: '/statistiques' },
            { label: 'Exports', icon: 'download', route: '/exports' },
          ],
        },
      ],
      [Role.ADMIN]: [
        {
          title: 'Administration',
          items: [
            { label: 'Utilisateurs', icon: 'manage_accounts', route: '/gestion-utilisateurs' },
            { label: 'Stats système', icon: 'insights', route: '/stats-systeme' },
          ],
        },
        {
          title: 'Suivi',
          items: [
            { label: 'Statistiques', icon: 'query_stats', route: '/statistiques' },
            { label: 'Exports', icon: 'download', route: '/exports' },
          ],
        },
      ],
    };

    if (!role) {
      return [common];
    }

    return [common, ...byRole[role]];
  }
}
