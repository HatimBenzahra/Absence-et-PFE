# Plan de Travail : Système de Gestion PFE et Absences ISTY

## Informations Projet
- **Nom**: isty-pfe-absences
- **Stack**: Angular + Spring Boot + MySQL + Docker
- **Répertoire**: /Users/hatimbenzahra/isty-pfe-absences

---

## PHASE 1 : INITIALISATION DU PROJET

### 1.1 Structure Backend Spring Boot
- [ ] Créer le projet Spring Boot avec les dépendances (Spring Web, JPA, Security, MySQL, Lombok, Validation)
- [ ] Configurer application.yml (MySQL, JWT, CORS)
- [ ] Créer la structure des packages (entity, repository, service, controller, dto, config, security)
**Parallélisable**: NON (fondation requise)

### 1.2 Structure Frontend Angular  
- [ ] Créer le projet Angular avec Angular CLI
- [ ] Installer les dépendances (Angular Material, ngx-qrcode, chart.js)
- [ ] Configurer la structure des modules (core, shared, features)
- [ ] Configurer le routing principal et les guards
**Parallélisable**: OUI avec 1.1

### 1.3 Configuration Docker
- [ ] Créer docker-compose.yml (MySQL, phpMyAdmin)
- [ ] Créer Dockerfile pour le backend
- [ ] Créer Dockerfile pour le frontend
**Parallélisable**: OUI avec 1.1 et 1.2

---

## PHASE 2 : BACKEND - MODULE UTILISATEURS ET SÉCURITÉ

### 2.1 Entités Utilisateurs
- [ ] Créer l'entité Utilisateur (classe de base)
- [ ] Créer l'entité Etudiant (extends Utilisateur)
- [ ] Créer l'entité Enseignant (extends Utilisateur)
- [ ] Créer l'entité ResponsablePFE (extends Utilisateur)
- [ ] Créer l'enum Role (ETUDIANT, ENSEIGNANT, RESPONSABLE_PFE, SECRETARIAT, ADMIN)
**Parallélisable**: NON (fondation)

### 2.2 Sécurité JWT
- [ ] Configurer Spring Security avec JWT
- [ ] Créer JwtTokenProvider, JwtAuthenticationFilter
- [ ] Créer AuthController (login, register, refresh)
- [ ] Créer les DTOs d'authentification (LoginRequest, RegisterRequest, JwtResponse)
**Parallélisable**: NON (dépend de 2.1)

### 2.3 Repositories et Services Utilisateurs
- [ ] Créer UtilisateurRepository, EtudiantRepository, EnseignantRepository
- [ ] Créer UtilisateurService avec méthodes CRUD
- [ ] Créer AuthService pour l'authentification
**Parallélisable**: NON (dépend de 2.1)

---

## PHASE 3 : BACKEND - MODULE PFE

### 3.1 Entités PFE
- [ ] Créer l'entité Sujet (id, titre, description, motsCles, statut, enseignant)
- [ ] Créer l'entité Candidature (id, rangPreference, dateCandidature, statut, etudiant, sujet)
- [ ] Créer l'entité AffectationPFE (id, dateAffectation, statut, etudiant, sujet, encadrant)
- [ ] Créer l'entité Livrable (id, type, urlFichier, dateDepot, affectation)
- [ ] Créer les enums (StatutSujet, StatutCandidature, StatutAffectation, TypeLivrable)
**Parallélisable**: OUI avec Phase 4.1

### 3.2 Repositories PFE
- [ ] Créer SujetRepository avec requêtes personnalisées
- [ ] Créer CandidatureRepository
- [ ] Créer AffectationPFERepository
- [ ] Créer LivrableRepository
**Parallélisable**: NON (dépend de 3.1)

### 3.3 Services PFE
- [ ] Créer SujetService (dépôt, validation, consultation)
- [ ] Créer CandidatureService (soumission, classement, consultation)
- [ ] Créer AffectationService (affectation auto/manuelle)
- [ ] Créer LivrableService (dépôt, suivi)
**Parallélisable**: NON (dépend de 3.2)

### 3.4 Controllers PFE
- [ ] Créer SujetController (REST API complète)
- [ ] Créer CandidatureController
- [ ] Créer AffectationController
- [ ] Créer LivrableController
**Parallélisable**: NON (dépend de 3.3)

---

## PHASE 4 : BACKEND - MODULE ABSENCES

### 4.1 Entités Absences
- [ ] Créer l'entité Seance (id, matiere, typeSeance, dateHeureDebut, dateHeureFin, groupe, tokenQR, enseignant)
- [ ] Créer l'entité Presence (id, statut, modeSaisie, horodatage, etudiant, seance)
- [ ] Créer l'entité Justificatif (id, motif, urlFichier, dateDepot, statutValidation, presence)
- [ ] Créer les enums (TypeSeance, StatutPresence, ModeSaisie, StatutJustificatif)
**Parallélisable**: OUI avec Phase 3.1

### 4.2 Repositories Absences
- [ ] Créer SeanceRepository avec requêtes personnalisées
- [ ] Créer PresenceRepository
- [ ] Créer JustificatifRepository
**Parallélisable**: NON (dépend de 4.1)

### 4.3 Services Absences
- [ ] Créer SeanceService (création, génération QR)
- [ ] Créer PresenceService (pointage QR, pointage manuel)
- [ ] Créer JustificatifService (dépôt, validation)
- [ ] Créer StatistiquesService (assiduité par groupe, matière, période)
**Parallélisable**: NON (dépend de 4.2)

### 4.4 Controllers Absences
- [ ] Créer SeanceController (REST API + génération QR)
- [ ] Créer PresenceController
- [ ] Créer JustificatifController
- [ ] Créer StatistiquesController (export CSV/PDF)
**Parallélisable**: NON (dépend de 4.3)

---

## PHASE 5 : FRONTEND - MODULE CORE ET SHARED

### 5.1 Module Core
- [ ] Créer AuthService (login, logout, token management)
- [ ] Créer AuthGuard et RoleGuard
- [ ] Créer HttpInterceptor pour JWT
- [ ] Créer les modèles TypeScript (User, Etudiant, Enseignant)
**Parallélisable**: NON (fondation frontend)

### 5.2 Module Shared
- [ ] Créer les composants réutilisables (Header, Sidebar, Footer)
- [ ] Créer les composants UI (Loading, Confirmation Dialog, Notification)
- [ ] Configurer Angular Material theme
**Parallélisable**: NON (dépend de 5.1)

### 5.3 Pages Auth
- [ ] Créer LoginComponent
- [ ] Créer RegisterComponent
- [ ] Créer ForgotPasswordComponent
**Parallélisable**: NON (dépend de 5.1)

---

## PHASE 6 : FRONTEND - MODULE PFE

### 6.1 Pages Sujets
- [ ] Créer SujetListComponent (liste des sujets validés)
- [ ] Créer SujetDetailComponent
- [ ] Créer SujetFormComponent (dépôt de sujet - enseignant)
- [ ] Créer SujetValidationComponent (validation - responsable PFE)
**Parallélisable**: OUI avec Phase 7.1

### 6.2 Pages Candidatures
- [ ] Créer CandidatureFormComponent (candidature avec classement)
- [ ] Créer MesCandidaturesComponent (suivi candidatures - étudiant)
- [ ] Créer CandidaturesListComponent (gestion - responsable PFE)
**Parallélisable**: NON (dépend de 6.1)

### 6.3 Pages Affectations
- [ ] Créer AffectationDashboardComponent (responsable PFE)
- [ ] Créer MonPFEComponent (étudiant - suivi avancement)
- [ ] Créer MesEncadrementsComponent (enseignant)
**Parallélisable**: NON (dépend de 6.2)

### 6.4 Pages Livrables
- [ ] Créer LivrableUploadComponent (dépôt livrable - étudiant)
- [ ] Créer LivrablesListComponent (suivi - enseignant)
**Parallélisable**: NON (dépend de 6.3)

---

## PHASE 7 : FRONTEND - MODULE ABSENCES

### 7.1 Pages Séances
- [ ] Créer SeanceListComponent (liste des séances - enseignant)
- [ ] Créer SeanceFormComponent (création séance)
- [ ] Créer SeanceQRComponent (affichage QR code)
**Parallélisable**: OUI avec Phase 6.1

### 7.2 Pages Pointage
- [ ] Créer PointageQRComponent (scan QR - étudiant)
- [ ] Créer PointageManuelComponent (saisie manuelle - enseignant)
- [ ] Créer MesPresencesComponent (historique - étudiant)
**Parallélisable**: NON (dépend de 7.1)

### 7.3 Pages Justificatifs
- [ ] Créer JustificatifUploadComponent (dépôt - étudiant)
- [ ] Créer JustificatifsValidationComponent (validation - enseignant)
- [ ] Créer MesJustificatifsComponent (suivi - étudiant)
**Parallélisable**: NON (dépend de 7.2)

### 7.4 Pages Statistiques
- [ ] Créer StatistiquesComponent (tableaux de bord)
- [ ] Créer ExportComponent (export CSV/PDF)
- [ ] Intégrer Chart.js pour les graphiques
**Parallélisable**: NON (dépend de 7.3)

---

## PHASE 8 : INTÉGRATION ET TESTS

### 8.1 Tests Backend
- [ ] Tests unitaires services
- [ ] Tests intégration controllers
- [ ] Tests sécurité JWT
**Parallélisable**: OUI

### 8.2 Tests Frontend
- [ ] Tests composants critiques
- [ ] Tests services
- [ ] Tests E2E (optionnel)
**Parallélisable**: OUI avec 8.1

### 8.3 Intégration Finale
- [ ] Test intégration complète Frontend-Backend
- [ ] Correction bugs
- [ ] Optimisation performances
**Parallélisable**: NON

---

## PHASE 9 : DÉPLOIEMENT

### 9.1 Docker Production
- [ ] Finaliser docker-compose production
- [ ] Configurer variables d'environnement
- [ ] Build images production
**Parallélisable**: NON

### 9.2 Documentation
- [ ] README.md avec instructions installation
- [ ] Documentation API (Swagger)
- [ ] Guide utilisateur
**Parallélisable**: OUI avec 9.1

---

## NOTES IMPORTANTES

### Technologies Utilisées
- **Backend**: Java 17+, Spring Boot 3.x, Spring Security, JWT, JPA/Hibernate
- **Frontend**: Angular 17+, Angular Material, RxJS, ngx-qrcode
- **BDD**: MySQL 8.x
- **DevOps**: Docker, Docker Compose

### Conventions de Code
- Backend: CamelCase pour Java, REST conventions
- Frontend: kebab-case pour fichiers, PascalCase pour composants
- Git: Conventional Commits (feat:, fix:, docs:, etc.)
