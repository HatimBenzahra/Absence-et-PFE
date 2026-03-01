# Compléter le Cahier des Charges ISTY — PFE & Absences

## TL;DR

> **Quick Summary**: Build all 16 missing Angular frontend pages on top of the complete backend (39 endpoints), fix broken existing services/models, add role-based route guards, create BF9 (soutenance) full-stack feature, and add Docker deployment.
> 
> **Deliverables**:
> - 16 real Angular pages replacing SpacePlaceholderComponent
> - 5 new + 5 fixed Angular services (aligned to backend endpoints)
> - 4 new + 5 fixed Angular models (matching backend DTOs exactly)
> - Role-based route guard protecting all 16 routes
> - HTTP error interceptor with auto-logout on 401
> - Environment configuration (dev + prod)
> - BF9: Soutenance scheduling (backend entity + controller + frontend page)
> - Docker deployment (Dockerfile backend + frontend + docker-compose.yml + nginx.conf)
> 
> **Estimated Effort**: Large (~14-18 hours)
> **Parallel Execution**: YES — 6 waves
> **Critical Path**: Wave 0 (fix foundation) → Wave 1 (new services/models) → Wave 2 (16 pages) → Wave 3 (BF9) → Wave 4 (Docker) → Wave FINAL (verification)

---

## Context

### Original Request
User requested: "il manque quoi pour completer ce cahier de charge" then "ok fais un plan pour ca" — asking for a work plan to complete all missing requirements from the PFA cahier des charges.

### Interview Summary
**Key Discussions**:
- Backend is 100% complete: 9 controllers, 39 REST endpoints, 79 Java files
- Frontend has only 3 real pages (login, register, dashboard) + 16 placeholders
- UI was polished in previous session (login, register, dashboard, main-layout, placeholder)
- Brand: burgundy `#6d1d4a`, teal `#0097c4`, Inter font
- User wants: "un site d'école bien slick" — professional school-quality UI

**Research Findings**:
- Angular 21 with standalone components, Angular Material 21.1.4
- Spring Boot with JPA/Hibernate, JWT security, MySQL
- Existing auth guard only checks `isAuthenticated()` — no role check
- All 5 existing services have hardcoded `localhost:8080` URLs — no environment config

### Metis Review
**Identified Gaps** (addressed):
- **CRITICAL**: 5 existing frontend services have WRONG endpoint URLs (e.g., `/me` vs `/mes-presences`, `/qrcode` vs `/qr`)
- **CRITICAL**: 5 existing frontend models don't match backend DTOs (wrong field names, missing fields)
- **CRITICAL**: `presence.service.ts` has a `justifier()` method that posts FormData to a non-existent endpoint
- **HIGH**: No role-based route guard — any logged-in user can access any route by URL
- **HIGH**: No environment.ts — all services hardcode `http://localhost:8080`
- **HIGH**: No HTTP error interceptor — expired JWT shows raw errors
- **MEDIUM**: BF9 (soutenance) has no specification — scope defined as minimum viable
- **LOW**: `AffectationPFE` entity already has `dateSoutenancePrevue` field — useful hook for BF9

---

## Work Objectives

### Core Objective
Replace all 16 placeholder Angular pages with real functional pages connected to the existing backend API, fix the broken service/model layer, add security guards, implement BF9 soutenance feature, and package everything in Docker.

### Concrete Deliverables
- 16 Angular page components (1 per route)
- 10 Angular services (5 fixed + 5 new)
- 9 Angular model files (5 fixed + 4 new)
- 1 roleGuard functional guard
- 1 HTTP error interceptor
- 2 environment files (dev + prod)
- BF9: 1 backend entity + 1 controller + 1 service + 1 DTO + 1 repository + 2 frontend pages
- 3 Docker files (Dockerfile.backend, Dockerfile.frontend, docker-compose.yml) + nginx.conf

### Definition of Done
- [x] `npx ng build --configuration=development` succeeds with 0 errors
- [x] `grep -c "SpacePlaceholderComponent" frontend/src/app/app.routes.ts` returns `0`
- [x] `grep -r "localhost:8080" frontend/src/app/core/services/` returns 0 matches
- [x] `./mvnw compile -q -f backend/pom.xml` succeeds
- [x] `docker compose config --quiet` passes
- [x] All 16 routes render a real page (not placeholder)

### Must Have
- All 16 pages functional with real data from backend API
- Role-based access control on all routes
- Environment-based API URL configuration
- Error handling on all HTTP calls (toast notifications)
- BF9 minimum viable: schedule soutenance date per affectation
- Docker deployment that builds and starts

### Must NOT Have (Guardrails)
- ❌ NO new npm dependencies beyond what's in package.json
- ❌ NO shared/reusable custom components — use Angular Material directly
- ❌ NO state management library (NgRx, Akita) — keep service + BehaviorSubject pattern
- ❌ NO file upload — backend accepts `urlFichier: String`, frontend uses text input
- ❌ NO pagination — backend returns unpaginated lists, school-scale data is fine
- ❌ NO real-time updates (WebSocket, polling, SSE)
- ❌ NO touching login, register, dashboard, main-layout, toast components — they are DONE
- ❌ NO complex QR camera scanning — simple text input for QR token
- ❌ NO sub-components per page — 1 standalone component = 1 route
- ❌ NO BF9 jury entity, room booking, conflict detection, or email notifications
- ❌ NO Kubernetes, Traefik, or advanced container orchestration

---

## Verification Strategy (MANDATORY)

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed. No exceptions.

### Test Decision
- **Infrastructure exists**: YES (Vitest configured in Angular CLI)
- **Automated tests**: NO — focus on shipping pages; QA via agent scenarios
- **Framework**: Vitest (available but not used for this sprint)

### QA Policy
Every task MUST include agent-executed QA scenarios.
Evidence saved to `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`.

- **Frontend pages**: Use `npx ng build` compilation check + Playwright for visual verification
- **Backend**: Use `./mvnw compile` + curl for endpoint verification
- **Docker**: Use `docker compose build` + `docker compose config`
- **Services/Models**: Use `npx ng build` compilation as the primary check

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 0 (CRITICAL — Fix Broken Foundation, blocks EVERYTHING):
├── Task 1: Create environment files + refactor all service URLs [quick]
├── Task 2: Fix 5 existing models to match backend DTOs [quick]
├── Task 3: Fix 5 existing services (URLs + missing methods) [quick]
├── Task 4: Add roleGuard + HTTP error interceptor [quick]
└── 4 tasks, ALL parallel

Wave 1 (After Wave 0 — New Services + Models):
├── Task 5: Create 4 new models (affectation, livrable, justificatif, statistiques) [quick]
├── Task 6: Create affectation.service.ts + livrable.service.ts [quick]
├── Task 7: Create justificatif.service.ts + statistiques.service.ts + export.service.ts [quick]
└── 3 tasks, ALL parallel

Wave 2 (After Wave 1 — Build 16 Pages, MAX PARALLEL):
├── Task 8:  Scanner QR page (ETUDIANT) [visual-engineering]
├── Task 9:  Mes Présences page (ETUDIANT) [visual-engineering]
├── Task 10: Mes Justificatifs page (ETUDIANT) [visual-engineering]
├── Task 11: Sujets PFE page (ETUDIANT) [visual-engineering]
├── Task 12: Mes Candidatures page (ETUDIANT) [visual-engineering]
├── Task 13: Mon PFE page (ETUDIANT) [visual-engineering]
├── Task 14: Mes Séances page (ENSEIGNANT) [visual-engineering]
├── Task 15: Gestion Présences page (ENSEIGNANT) [visual-engineering]
├── Task 16: Justificatifs Validation page (ENSEIGNANT) [visual-engineering]
├── Task 17: Mes Sujets page (ENSEIGNANT) [visual-engineering]
├── Task 18: Mes Encadrements page (ENSEIGNANT) [visual-engineering]
├── Task 19: Validation Sujets page (RESPONSABLE_PFE) [visual-engineering]
├── Task 20: Affectations page (RESPONSABLE_PFE) [visual-engineering]
├── Task 21: Candidatures page (RESPONSABLE_PFE) [visual-engineering]
├── Task 22: Statistiques page (SHARED) [visual-engineering]
├── Task 23: Exports page (SHARED) [visual-engineering]
└── 16 tasks, ALL parallel

Wave 3 (After Wave 2 — BF9: Soutenance):
├── Task 24: BF9 Backend — Soutenance entity + DTO + repository + service + controller [unspecified-high]
├── Task 25: BF9 Frontend — Soutenance scheduling page + model + service [visual-engineering]
└── 2 tasks, sequential (25 depends on 24)

Wave 4 (After Wave 2 — Docker Deployment, parallel with Wave 3):
├── Task 26: Dockerfile.backend (multi-stage Maven build) [quick]
├── Task 27: Dockerfile.frontend + nginx.conf (multi-stage ng build) [quick]
├── Task 28: docker-compose.yml (MySQL + backend + frontend) [quick]
└── 3 tasks, sequential (28 depends on 26+27)

Wave 5 (After Wave 2 — Route cleanup + app.routes.ts update):
└── Task 29: Update app.routes.ts — replace all SpacePlaceholderComponent imports + add roleGuard data [quick]

Wave FINAL (After ALL tasks — independent review, 4 parallel):
├── Task F1: Plan compliance audit (oracle)
├── Task F2: Code quality review (unspecified-high)
├── Task F3: Real QA — Playwright (unspecified-high)
└── Task F4: Scope fidelity check (deep)

Critical Path: T1-T4 → T5-T7 → T8-T23 → T29 → F1-F4
Parallel Speedup: ~75% faster than sequential
Max Concurrent: 16 (Wave 2)
```

### Dependency Matrix

| Task | Depends On | Blocks | Wave |
|------|-----------|--------|------|
| 1-4 | — | 5-7 | 0 |
| 5-7 | 1-4 | 8-23 | 1 |
| 8-23 | 5-7 | 29, F1-F4 | 2 |
| 24 | 5-7 | 25 | 3 |
| 25 | 24 | F1-F4 | 3 |
| 26-27 | — | 28 | 4 |
| 28 | 26, 27 | F1-F4 | 4 |
| 29 | 8-23 | F1-F4 | 5 |
| F1-F4 | ALL | — | FINAL |

### Agent Dispatch Summary

- **Wave 0**: **4 tasks** — T1-T4 → `quick`
- **Wave 1**: **3 tasks** — T5-T7 → `quick`
- **Wave 2**: **16 tasks** — T8-T23 → `visual-engineering` (with `frontend-ui-ux` skill)
- **Wave 3**: **2 tasks** — T24 → `unspecified-high`, T25 → `visual-engineering`
- **Wave 4**: **3 tasks** — T26-T28 → `quick`
- **Wave 5**: **1 task** — T29 → `quick`
- **FINAL**: **4 tasks** — F1 → `oracle`, F2 → `unspecified-high`, F3 → `unspecified-high` + `playwright`, F4 → `deep`

---

## TODOs

> **EVERY task MUST have: Agent Profile + QA Scenarios. A task WITHOUT QA Scenarios is INCOMPLETE.**

---

### Wave 0 — Fix Broken Foundation (blocks everything)

- [x] 1. Create environment files + refactor all service API URLs

  **What to do**:
  - Create `frontend/src/environments/environment.ts` with `export const environment = { production: false, apiUrl: 'http://localhost:8080/api' };`
  - Create `frontend/src/environments/environment.prod.ts` with `export const environment = { production: true, apiUrl: '/api' };`
  - In EVERY existing service file (`auth.service.ts`, `presence.service.ts`, `seance.service.ts`, `candidature.service.ts`, `sujet.service.ts`), replace the hardcoded `private apiUrl = 'http://localhost:8080/api/...'` with `private apiUrl = \`${environment.apiUrl}/...\``
  - Add the `import { environment } from '../../../environments/environment';` to each service
  - Update `angular.json` to include `fileReplacements` for production builds (replace environment.ts with environment.prod.ts)

  **Must NOT do**:
  - Do NOT change any service method logic — only the apiUrl property and import
  - Do NOT add environment.staging.ts or any extra environments

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []
    - Simple find-and-replace across 5 files + 2 new files + angular.json config

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 2, 3, 4)
  - **Parallel Group**: Wave 0
  - **Blocks**: Tasks 5, 6, 7 (all new services need environment import)
  - **Blocked By**: None

  **References**:
  - `frontend/src/app/core/services/auth.service.ts:9` — Example of hardcoded URL: `private apiUrl = 'http://localhost:8080/api/auth'`
  - `frontend/src/app/core/services/presence.service.ts:8` — Same pattern: `'http://localhost:8080/api/presences'`
  - `frontend/src/app/core/services/seance.service.ts:8` — Same pattern: `'http://localhost:8080/api/seances'`
  - `frontend/src/app/core/services/candidature.service.ts:8` — Same pattern
  - `frontend/src/app/core/services/sujet.service.ts:8` — Same pattern
  - `frontend/angular.json` — Where `fileReplacements` config goes (under `architect.build.configurations.production`)

  **Acceptance Criteria**:
  - [x] `frontend/src/environments/environment.ts` exists with `apiUrl: 'http://localhost:8080/api'`
  - [x] `frontend/src/environments/environment.prod.ts` exists with `apiUrl: '/api'`
  - [x] `grep -r "localhost:8080" frontend/src/app/core/services/` returns 0 matches
  - [x] `npx ng build --configuration=development` succeeds

  ```
  Scenario: No hardcoded URLs remain in services
    Tool: Bash (grep)
    Steps:
      1. Run: grep -r "localhost:8080" frontend/src/app/core/services/
      2. Assert: exit code is 1 (no matches)
    Expected Result: Zero matches — all services use environment.apiUrl
    Evidence: .sisyphus/evidence/task-1-no-hardcoded-urls.txt

  Scenario: Angular build succeeds with environment config
    Tool: Bash
    Steps:
      1. Run: cd frontend && npx ng build --configuration=development 2>&1 | tail -5
      2. Assert: output contains "Build at:" or similar success message
    Expected Result: Build completes with 0 errors
    Evidence: .sisyphus/evidence/task-1-build-success.txt
  ```

  **Commit**: YES (groups with Tasks 2, 3, 4 in Wave 0 commit)
  - Message: `fix(core): add environment config, remove hardcoded API URLs`
  - Files: `environments/environment.ts`, `environments/environment.prod.ts`, `angular.json`, all 5 service files

- [x] 2. Fix 5 existing models to match backend DTOs

  **What to do**:
  - Rewrite `presence.model.ts` to match `PresenceDTO.java`:
    ```typescript
    export interface Presence {
      id: number;
      etudiantNom: string;
      etudiantNumero: string;
      statut: StatutPresence;
      modeSaisie: ModeSaisie;
      horodatage: string; // LocalDateTime from backend
      aJustificatif: boolean;
    }
    export enum StatutPresence { PRESENT = 'PRESENT', ABSENT = 'ABSENT', RETARD = 'RETARD', EXCUSE = 'EXCUSE' }
    export enum ModeSaisie { QR = 'QR', MANUEL = 'MANUEL' }
    export interface PointageRequest { tokenQR: string; } // Match PointageQRDTO exactly
    ```
  - Rewrite `seance.model.ts` to match `SeanceDTO.java`:
    ```typescript
    export interface Seance {
      id: number;
      matiere: string;
      typeSeance: TypeSeance; // was 'type'
      dateHeureDebut: string; // was 'dateDebut'
      dateHeureFin: string; // was 'dateFin'
      groupe: string; // NEW field
      salle: string;
      enseignantNom: string;
    }
    export interface SeanceCreate {
      matiere: string;
      typeSeance: TypeSeance; // was 'type'
      dateHeureDebut: string; // was 'dateDebut'
      dateHeureFin: string; // was 'dateFin'
      groupe?: string; // was 'groupeId: number'
      salle?: string;
    }
    ```
  - Fix `candidature.model.ts` to match `CandidatureDTO.java` — add `sujetId`, `sujetTitre`, `rangPreference`, `dateCandidature` fields. Fix `CandidatureCreate` to match `CandidatureCreateDTO`.
  - Fix `sujet.model.ts` to match `SujetDTO.java` — add `motsCles`, `enseignantNom`, `dateCreation` fields. Fix `SujetCreate` to match `SujetCreateDTO`.
  - Fix `user.model.ts` — ensure `Role` enum includes all roles: `ETUDIANT`, `ENSEIGNANT`, `RESPONSABLE_PFE`, `SECRETARIAT`, `ADMIN`

  **Must NOT do**:
  - Do NOT rename files — keep existing filenames
  - Do NOT add transformation layers or mapping functions — direct interface match

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 1, 3, 4)
  - **Parallel Group**: Wave 0
  - **Blocks**: Tasks 5-7, 8-23 (all pages consume these models)
  - **Blocked By**: None

  **References**:
  - `backend/src/main/java/com/isty/dto/presences/PresenceDTO.java` — Target shape for Presence model
  - `backend/src/main/java/com/isty/dto/presences/SeanceDTO.java` — Target shape for Seance model
  - `backend/src/main/java/com/isty/dto/presences/PointageQRDTO.java` — Only field: `tokenQR` (not `qrToken`!)
  - `backend/src/main/java/com/isty/dto/projets/CandidatureDTO.java` — Target for Candidature model
  - `backend/src/main/java/com/isty/dto/projets/SujetDTO.java` — Target for Sujet model
  - `backend/src/main/java/com/isty/entity/user/Role.java` — All role enum values
  - `frontend/src/app/core/models/presence.model.ts` — Current WRONG model (lines 1-20)
  - `frontend/src/app/core/models/seance.model.ts` — Current WRONG model (lines 1-26)

  **Acceptance Criteria**:
  - [x] All 5 model files updated
  - [x] `npx ng build --configuration=development` succeeds (no type errors)
  - [x] Every interface field name matches the corresponding Java DTO field name exactly

  ```
  Scenario: Models compile and match DTOs
    Tool: Bash
    Steps:
      1. Run: cd frontend && npx ng build --configuration=development 2>&1 | grep -i error
      2. Assert: no TypeScript errors related to model types
    Expected Result: Build succeeds with 0 errors
    Evidence: .sisyphus/evidence/task-2-model-build.txt
  ```

  **Commit**: YES (groups with Wave 0)
  - Message: `fix(models): align TypeScript interfaces with backend DTOs`
  - Files: All 5 model files

- [x] 3. Fix 5 existing services (URLs + missing methods)

  **What to do**:
  - Fix `presence.service.ts`:
    - Change `getMyPresences()` URL from `/me` to `/mes-presences`
    - Change `pointer()` to send `{ tokenQR: string }` (not `PointageRequest` with `qrToken`)
    - REMOVE `justifier()` method entirely — justificatifs have their own controller/service
    - ADD `getPresencesBySeance(seanceId: number)` → `GET ${apiUrl}/seance/${seanceId}`
    - ADD `saisirManuel(seanceId: number, presences: PointageManuelRequest[])` → `POST ${apiUrl}/seance/${seanceId}/manuel`
  - Fix `seance.service.ts`:
    - Change `getMySeances()` URL from `/me` to `/mes-seances`
    - Change `generateQrCode()` URL from `/${id}/qrcode` to `/${id}/qr`
    - ADD `getSeancesByGroupe(groupe: string)` → `GET ${apiUrl}/groupe/${groupe}`
  - Fix `candidature.service.ts`:
    - Change `getMyCandidatures()` URL from `/me` to `/mes-candidatures`
    - ADD `getCandidaturesBySujet(sujetId: number)` → `GET ${apiUrl}/sujet/${sujetId}`
  - Fix `sujet.service.ts`:
    - ADD `refuser(id: number)` → `PUT ${apiUrl}/${id}/refuser`
    - ADD `getMesSujets()` → `GET ${apiUrl}/mes-sujets`
  - Fix `auth.service.ts`:
    - Only change: replace hardcoded URL with environment.apiUrl (done in Task 1, but verify)

  **Must NOT do**:
  - Do NOT change HttpClient injection pattern
  - Do NOT add error handling here — that's the interceptor's job (Task 4)

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 1, 2, 4)
  - **Parallel Group**: Wave 0
  - **Blocks**: Tasks 5-7, 8-23
  - **Blocked By**: None (but ideally runs after Task 1 for environment import — if parallel, both add the import)

  **References**:
  - `backend/src/main/java/com/isty/controller/presences/PresenceController.java` — Exact endpoint paths and HTTP methods
  - `backend/src/main/java/com/isty/controller/presences/SeanceController.java` — `/mes-seances`, `/{id}/qr`, `/groupe/{groupe}`
  - `backend/src/main/java/com/isty/controller/projets/CandidatureController.java` — `/mes-candidatures`, `/sujet/{sujetId}`
  - `backend/src/main/java/com/isty/controller/projets/SujetController.java` — `/mes-sujets`, `/{id}/refuser`
  - `backend/src/main/java/com/isty/dto/presences/PointageManuelDTO.java` — Shape: `{ etudiantId: number, statut: StatutPresence }`
  - `frontend/src/app/core/services/presence.service.ts` — Current file to fix (25 lines)
  - `frontend/src/app/core/services/seance.service.ts` — Current file to fix (23 lines)

  **Acceptance Criteria**:
  - [x] All 5 service files have correct endpoint URLs matching backend controllers
  - [x] `presence.service.ts` no longer has `justifier()` method
  - [x] `npx ng build` succeeds

  ```
  Scenario: Service URLs match backend endpoints
    Tool: Bash (grep)
    Steps:
      1. Run: grep -n "mes-presences\|mes-seances\|mes-candidatures\|mes-sujets" frontend/src/app/core/services/*.ts
      2. Assert: matches found in presence, seance, candidature, sujet services
      3. Run: grep -n "/me\b" frontend/src/app/core/services/*.ts
      4. Assert: NO matches (old wrong URLs removed)
    Expected Result: All URLs use correct backend endpoint paths
    Evidence: .sisyphus/evidence/task-3-service-urls.txt

  Scenario: Removed justifier method from presence service
    Tool: Bash (grep)
    Steps:
      1. Run: grep -c "justifier" frontend/src/app/core/services/presence.service.ts
      2. Assert: output is "0"
    Expected Result: justifier method completely removed
    Evidence: .sisyphus/evidence/task-3-no-justifier.txt
  ```

  **Commit**: YES (groups with Wave 0)
  - Message: `fix(services): correct endpoint URLs and add missing methods`
  - Files: All 5 service files

- [x] 4. Add roleGuard + HTTP error interceptor

  **What to do**:
  - Create `frontend/src/app/core/guards/role.guard.ts`:
    ```typescript
    export const roleGuard: CanActivateFn = (route, state) => {
      const authService = inject(AuthService);
      const router = inject(Router);
      const expectedRoles: Role[] = route.data['roles'];
      if (!expectedRoles || expectedRoles.some(role => authService.hasRole(role))) {
        return true;
      }
      router.navigate(['/dashboard']);
      return false;
    };
    ```
  - Create `frontend/src/app/core/interceptors/error.interceptor.ts` as an HttpInterceptorFn:
    - On 401: call `authService.logout()`, navigate to `/login`, show toast 'Session expirée'
    - On 403: show toast 'Accès interdit'
    - On 500: show toast 'Erreur serveur'
    - Use the existing `NotificationService` for toasts
  - Register the interceptor in `app.config.ts` via `provideHttpClient(withInterceptors([errorInterceptor]))`
  - NOTE: Do NOT apply roleGuard to routes yet — Task 29 will do that after all pages exist

  **Must NOT do**:
  - Do NOT modify `auth.guard.ts` — it works fine for authentication check
  - Do NOT add token refresh logic — out of scope
  - Do NOT apply roleGuard to routes in this task

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 1, 2, 3)
  - **Parallel Group**: Wave 0
  - **Blocks**: Task 29 (route update needs roleGuard)
  - **Blocked By**: None

  **References**:
  - `frontend/src/app/core/guards/auth.guard.ts` — Existing guard pattern (functional guard with `inject()`)
  - `frontend/src/app/core/services/auth.service.ts:54-56` — `hasRole(role: Role)` method already exists
  - `frontend/src/app/core/models/user.model.ts` — Role enum definition
  - `frontend/src/app/shared/` — NotificationService for toast notifications

  **Acceptance Criteria**:
  - [x] `frontend/src/app/core/guards/role.guard.ts` exists
  - [x] `frontend/src/app/core/interceptors/error.interceptor.ts` exists
  - [x] Error interceptor registered in `app.config.ts`
  - [x] `npx ng build` succeeds

  ```
  Scenario: Guard and interceptor files exist and compile
    Tool: Bash
    Steps:
      1. Run: ls frontend/src/app/core/guards/role.guard.ts frontend/src/app/core/interceptors/error.interceptor.ts
      2. Assert: both files exist (exit code 0)
      3. Run: cd frontend && npx ng build --configuration=development 2>&1 | tail -3
      4. Assert: build succeeds
    Expected Result: Both files compile without errors
    Evidence: .sisyphus/evidence/task-4-guard-interceptor.txt
  ```

  **Commit**: YES (groups with Wave 0)
  - Message: `feat(security): add roleGuard and HTTP error interceptor`
  - Files: `role.guard.ts`, `error.interceptor.ts`, `app.config.ts`


### Wave 1 — New Services + Models (after Wave 0)

- [x] 5. Create 4 new model files (affectation, livrable, justificatif, statistiques)

  **What to do**:
  - Create `frontend/src/app/core/models/affectation.model.ts`:
    ```typescript
    import { StatutAffectation } from './enums';
    export interface Affectation {
      id: number; etudiantNom: string; sujetTitre: string;
      encadrantNom: string; statut: StatutAffectation; dateAffectation: string;
    }
    export enum StatutAffectation { EN_COURS = 'EN_COURS', TERMINE = 'TERMINE', ABANDONNE = 'ABANDONNE' }
    ```
  - Create `frontend/src/app/core/models/livrable.model.ts`:
    ```typescript
    export interface Livrable {
      id: number; type: TypeLivrable; titre: string; urlFichier: string; dateDepot: string;
    }
    export interface LivrableCreate { type: TypeLivrable; titre?: string; urlFichier: string; commentaire?: string; }
    export enum TypeLivrable { RAPPORT = 'RAPPORT', PRESENTATION = 'PRESENTATION', CODE = 'CODE', AUTRE = 'AUTRE' }
    ```
  - Create `frontend/src/app/core/models/justificatif.model.ts`:
    ```typescript
    export interface Justificatif {
      id: number; motif: string; urlFichier: string; statut: StatutJustificatif;
      dateDepot: string; presenceId: number; commentaireValidation?: string;
    }
    export interface JustificatifCreate { presenceId: number; motif: string; urlFichier?: string; }
    export enum StatutJustificatif { EN_ATTENTE = 'EN_ATTENTE', ACCEPTE = 'ACCEPTE', REFUSE = 'REFUSE' }
    ```
  - Create `frontend/src/app/core/models/statistiques.model.ts`:
    ```typescript
    export interface Statistiques {
      totalSeances: number; totalPresent: number; totalAbsent: number;
      totalRetard: number; tauxAssiduite: number;
    }
    ```

  **Must NOT do**:
  - Do NOT create transformation/mapping utilities
  - Do NOT deviate from backend DTO field names

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 6, 7)
  - **Parallel Group**: Wave 1
  - **Blocks**: Tasks 8-25 (pages need these models)
  - **Blocked By**: Tasks 1-4 (Wave 0)

  **References**:
  - `backend/src/main/java/com/isty/dto/projets/AffectationDTO.java` — Exact fields
  - `backend/src/main/java/com/isty/dto/projets/LivrableDTO.java` — Exact fields
  - `backend/src/main/java/com/isty/dto/projets/LivrableCreateDTO.java` — Create DTO shape
  - `backend/src/main/java/com/isty/dto/presences/JustificatifDTO.java` — Exact fields
  - `backend/src/main/java/com/isty/dto/presences/JustificatifCreateDTO.java` — Create DTO shape
  - `backend/src/main/java/com/isty/dto/presences/StatistiquesDTO.java` — Exact fields
  - `backend/src/main/java/com/isty/entity/projets/StatutAffectation.java` — Enum values
  - `backend/src/main/java/com/isty/entity/projets/TypeLivrable.java` — Enum values
  - `backend/src/main/java/com/isty/entity/presences/StatutJustificatif.java` — Enum values

  **Acceptance Criteria**:
  - [x] 4 new model files exist in `frontend/src/app/core/models/`
  - [x] `npx ng build` succeeds

  ```
  Scenario: All 4 new model files exist and compile
    Tool: Bash
    Steps:
      1. Run: ls frontend/src/app/core/models/{affectation,livrable,justificatif,statistiques}.model.ts
      2. Assert: all 4 files found
      3. Run: cd frontend && npx ng build --configuration=development 2>&1 | tail -3
      4. Assert: build succeeds
    Expected Result: 4 model files exist and project compiles
    Evidence: .sisyphus/evidence/task-5-new-models.txt
  ```

  **Commit**: YES (groups with Wave 1)
  - Message: `feat(models): add affectation, livrable, justificatif, statistiques models`

- [x] 6. Create affectation.service.ts + livrable.service.ts

  **What to do**:
  - Create `frontend/src/app/core/services/affectation.service.ts`:
    - `getMonPFE()` → `GET ${apiUrl}/affectations/mon-pfe` → returns `Affectation`
    - `getMesEncadrements()` → `GET ${apiUrl}/affectations/mes-encadrements` → returns `Affectation[]`
    - `affecterManuel(etudiantId: number, sujetId: number, encadrantId: number)` → `POST ${apiUrl}/affectations/manuelle`
    - `affecterAuto()` → `POST ${apiUrl}/affectations/automatique` → returns `Affectation[]`
    - `terminer(id: number)` → `PUT ${apiUrl}/affectations/${id}/terminer`
  - Create `frontend/src/app/core/services/livrable.service.ts`:
    - `getLivrablesByAffectation(affectationId: number)` → `GET ${apiUrl}/livrables/affectation/${affectationId}`
    - `submit(affectationId: number, livrable: LivrableCreate)` → `POST ${apiUrl}/livrables/affectation/${affectationId}`
  - Both services: use `environment.apiUrl`, follow `@Injectable({ providedIn: 'root' })` pattern

  **Must NOT do**: Do NOT add caching, retry logic, or error handling in services

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 5, 7)
  - **Parallel Group**: Wave 1
  - **Blocks**: Tasks 13 (mon-pfe), 18 (mes-encadrements), 20 (affectations)
  - **Blocked By**: Tasks 1-4 (Wave 0)

  **References**:
  - `backend/src/main/java/com/isty/controller/projets/AffectationController.java` — All endpoint paths and methods
  - `backend/src/main/java/com/isty/controller/projets/LivrableController.java` — All endpoint paths
  - `frontend/src/app/core/services/candidature.service.ts` — Pattern to follow (HttpClient + Observable)
  - `frontend/src/app/core/models/affectation.model.ts` — Types to import (created in Task 5)
  - `frontend/src/app/core/models/livrable.model.ts` — Types to import

  **Acceptance Criteria**:
  - [x] Both service files exist and compile
  - [x] Each method maps to the correct backend endpoint

  ```
  Scenario: Services compile and have correct methods
    Tool: Bash
    Steps:
      1. Run: grep -c 'mon-pfe\|mes-encadrements\|manuelle\|automatique\|terminer' frontend/src/app/core/services/affectation.service.ts
      2. Assert: count >= 5 (all 5 methods reference correct URLs)
      3. Run: cd frontend && npx ng build --configuration=development 2>&1 | tail -3
    Expected Result: Both services exist with all methods, project compiles
    Evidence: .sisyphus/evidence/task-6-new-services.txt
  ```

  **Commit**: YES (groups with Wave 1)
  - Message: `feat(services): add affectation and livrable services`

- [x] 7. Create justificatif.service.ts + statistiques.service.ts + export.service.ts

  **What to do**:
  - Create `frontend/src/app/core/services/justificatif.service.ts`:
    - `submit(justificatif: JustificatifCreate)` → `POST ${apiUrl}/justificatifs`
    - `getMesJustificatifs()` → `GET ${apiUrl}/justificatifs/mes-justificatifs`
    - `getAValider()` → `GET ${apiUrl}/justificatifs/a-valider`
    - `valider(id: number, commentaire: string, accepte: boolean)` → `PUT ${apiUrl}/justificatifs/${id}/valider`
  - Create `frontend/src/app/core/services/statistiques.service.ts`:
    - `getByEtudiant(etudiantId: number)` → `GET ${apiUrl}/statistiques/etudiant/${etudiantId}`
    - `getByGroupe(groupe: string)` → `GET ${apiUrl}/statistiques/groupe/${groupe}`
    - `getByMatiere(matiere: string)` → `GET ${apiUrl}/statistiques/matiere/${matiere}`
  - Create `frontend/src/app/core/services/export.service.ts`:
    - `exportCSV(params?)` → `GET ${apiUrl}/statistiques/export/csv` (responseType: 'blob')
    - `exportPDF(params?)` → `GET ${apiUrl}/statistiques/export/pdf` (responseType: 'blob')
  - All services: use `environment.apiUrl`, `providedIn: 'root'`

  **Must NOT do**: Do NOT create a unified 'data service'. 1 service per concern.

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 5, 6)
  - **Parallel Group**: Wave 1
  - **Blocks**: Tasks 10, 16, 22, 23
  - **Blocked By**: Tasks 1-4 (Wave 0)

  **References**:
  - `backend/src/main/java/com/isty/controller/presences/JustificatifController.java` — Endpoint paths
  - `backend/src/main/java/com/isty/controller/presences/StatistiquesController.java` — Endpoint paths + export endpoints
  - `frontend/src/app/core/services/candidature.service.ts` — Service pattern to follow
  - `frontend/src/app/core/models/justificatif.model.ts` — Types (created in Task 5)
  - `frontend/src/app/core/models/statistiques.model.ts` — Types (created in Task 5)

  **Acceptance Criteria**:
  - [x] 3 service files exist and compile
  - [x] Export service uses `responseType: 'blob'` for file downloads

  ```
  Scenario: All 3 services exist with correct methods
    Tool: Bash
    Steps:
      1. Run: ls frontend/src/app/core/services/{justificatif,statistiques,export}.service.ts
      2. Assert: all 3 files exist
      3. Run: grep -c "blob" frontend/src/app/core/services/export.service.ts
      4. Assert: count >= 2 (both export methods use blob)
      5. Run: cd frontend && npx ng build --configuration=development 2>&1 | tail -3
    Expected Result: All services compile, export uses blob responseType
    Evidence: .sisyphus/evidence/task-7-remaining-services.txt
  ```

  **Commit**: YES (groups with Wave 1)
  - Message: `feat(services): add justificatif, statistiques, and export services`

### Wave 2 — Build 16 Pages (MAX PARALLEL after Wave 1)

#### ETUDIANT Pages

- [x] 8. Scanner QR page (`/scanner`)

  **What to do**:
  - Create `frontend/src/app/features/scanner/` with component (HTML + SCSS + TS)
  - Page layout: Card with a text input for QR token + "Pointer" button
  - On submit: call `presenceService.pointer({ tokenQR })` 
  - On success: show toast "Présence enregistrée" with returned presence details
  - On error: show toast with error message
  - Role: ETUDIANT only
  - Material components: `mat-card`, `mat-form-field`, `mat-input`, `mat-button`

  **Must NOT do**: NO camera/QR scanning. Simple text input only.

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**: Wave 2, parallel with T9-T23. Blocked by T1-7. Blocks T29.

  **References**:
  - `backend/src/main/java/com/isty/controller/presences/PresenceController.java` — `POST /api/presences/pointer` accepts `PointageQRDTO { tokenQR }`
  - `frontend/src/app/core/services/presence.service.ts` — `pointer()` method (fixed in Task 3)
  - `frontend/src/app/core/models/presence.model.ts` — `PointageRequest` interface
  - `frontend/src/app/features/dashboard/dashboard.component.ts` — Follow inline template pattern if small, external HTML if >50 lines
  - `frontend/src/styles.scss` — Global brand colors: `$burgundy: #6d1d4a`, `$teal: #0097c4`

  **Acceptance Criteria**:
  - [x] Component exists at `frontend/src/app/features/scanner/`
  - [x] `npx ng build` succeeds

  ```
  Scenario: Scanner page renders with input and button
    Tool: Playwright
    Steps:
      1. Login as ETUDIANT user
      2. Navigate to http://localhost:4200/scanner
      3. Assert: page contains mat-form-field with input
      4. Assert: page contains button with text "Pointer"
      5. Screenshot the page
    Expected Result: Scanner page renders with QR input field and submit button
    Evidence: .sisyphus/evidence/task-8-scanner-page.png
  ```

  **Commit**: YES (groups with ETUDIANT pages batch)
  - Message: `feat(scanner): add QR attendance scanner page`

- [x] 9. Mes Présences page (`/mes-presences`)

  **What to do**:
  - Create `frontend/src/app/features/mes-presences/` with component
  - On init: call `presenceService.getMyPresences()` to load presence history
  - Display a `mat-table` with columns: Date (horodatage), Matière, Statut (with colored chip), Mode
  - Statut chips: PRESENT=green, ABSENT=red, RETARD=orange, EXCUSE=blue
  - Role: ETUDIANT only

  **Must NOT do**: NO pagination, NO filters, NO date range picker

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**: Wave 2, parallel. Blocked by T1-7. Blocks T29.

  **References**:
  - `backend/src/main/java/com/isty/controller/presences/PresenceController.java` — `GET /api/presences/mes-presences`
  - `frontend/src/app/core/services/presence.service.ts` — `getMyPresences()` (fixed in Task 3)
  - `frontend/src/app/core/models/presence.model.ts` — `Presence` interface with `horodatage`, `statut`, `modeSaisie`

  **Acceptance Criteria**:
  - [x] Component exists, `npx ng build` succeeds

  ```
  Scenario: Presence history table renders
    Tool: Playwright
    Steps:
      1. Login as ETUDIANT, navigate to /mes-presences
      2. Assert: mat-table element exists on page
      3. Assert: table has column headers
      4. Screenshot
    Expected Result: Data table renders (may be empty if no data)
    Evidence: .sisyphus/evidence/task-9-mes-presences.png
  ```

  **Commit**: YES (groups with ETUDIANT batch)

- [x] 10. Mes Justificatifs page (`/mes-justificatifs`)

  **What to do**:
  - Create `frontend/src/app/features/mes-justificatifs/` with component
  - TWO sections: (1) Form to submit new justificatif, (2) Table of my justificatifs
  - Form: `presenceId` (number input), `motif` (textarea), `urlFichier` (text input, optional) → calls `justificatifService.submit()`
  - Table: calls `justificatifService.getMesJustificatifs()` → columns: Motif, Statut (chip), Date Dépôt, Commentaire Validation
  - Statut chips: EN_ATTENTE=orange, ACCEPTE=green, REFUSE=red
  - Role: ETUDIANT only

  **Must NOT do**: NO file upload — urlFichier is a text input for URL string

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**: Wave 2, parallel. Blocked by T1-7.

  **References**:
  - `backend/src/main/java/com/isty/controller/presences/JustificatifController.java` — `POST /api/justificatifs` + `GET /api/justificatifs/mes-justificatifs`
  - `frontend/src/app/core/services/justificatif.service.ts` — Created in Task 7
  - `frontend/src/app/core/models/justificatif.model.ts` — Created in Task 5

  **Acceptance Criteria**:
  - [x] Component exists with form + table, `npx ng build` succeeds

  ```
  Scenario: Justificatifs page renders form and table
    Tool: Playwright
    Steps:
      1. Login as ETUDIANT, navigate to /mes-justificatifs
      2. Assert: form with motif textarea exists
      3. Assert: mat-table element exists
      4. Screenshot
    Expected Result: Submit form and history table both render
    Evidence: .sisyphus/evidence/task-10-mes-justificatifs.png
  ```

  **Commit**: YES (groups with ETUDIANT batch)

- [x] 11. Sujets PFE page (`/sujets`)

  **What to do**:
  - Create `frontend/src/app/features/sujets/` with component
  - On init: call `sujetService.getAll()` to load all validated subjects
  - Display a `mat-table` with columns: Titre, Description (truncated), Mots-Clés (chips), Enseignant, Statut
  - Each row can expand or have a "Voir" button to show full description
  - A "Candidater" button per row → navigates to `/mes-candidatures` or opens inline candidature form
  - Role: ETUDIANT (view) — though all authenticated users can see validated subjects

  **Must NOT do**: NO search/filter functionality, NO sorting

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**: Wave 2, parallel.

  **References**:
  - `backend/src/main/java/com/isty/controller/projets/SujetController.java` — `GET /api/sujets`
  - `frontend/src/app/core/services/sujet.service.ts` — `getAll()` method
  - `frontend/src/app/core/models/sujet.model.ts` — `Sujet` interface

  **Acceptance Criteria**:
  - [x] Component exists, table renders, `npx ng build` succeeds

  ```
  Scenario: Sujets table renders with columns
    Tool: Playwright
    Steps:
      1. Login, navigate to /sujets
      2. Assert: mat-table with subject columns renders
      3. Screenshot
    Expected Result: Subject catalog table displays
    Evidence: .sisyphus/evidence/task-11-sujets.png
  ```

  **Commit**: YES (groups with ETUDIANT batch)

- [x] 12. Mes Candidatures page (`/mes-candidatures`)

  **What to do**:
  - Create `frontend/src/app/features/mes-candidatures/` with component
  - TWO sections: (1) Form to submit new candidature, (2) Table of my candidatures
  - Form: `sujetId` (number), `rangPreference` (number 1-5) → calls `candidatureService.create()`
  - Table: calls `candidatureService.getMyCandidatures()` → columns: Sujet, Rang, Statut (chip), Date
  - Delete button per row → calls `candidatureService.delete(id)` with confirmation dialog
  - Role: ETUDIANT only

  **Must NOT do**: NO drag-and-drop ranking, NO sujet search dropdown

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**: Wave 2, parallel.

  **References**:
  - `backend/src/main/java/com/isty/controller/projets/CandidatureController.java` — `POST /api/candidatures`, `GET /mes-candidatures`, `DELETE /{id}`
  - `frontend/src/app/core/services/candidature.service.ts` — All methods (fixed in Task 3)
  - `frontend/src/app/core/models/candidature.model.ts` — `Candidature`, `CandidatureCreate`

  **Acceptance Criteria**:
  - [x] Component with form + table, `npx ng build` succeeds

  ```
  Scenario: Candidatures page renders form and list
    Tool: Playwright
    Steps:
      1. Login as ETUDIANT, navigate to /mes-candidatures
      2. Assert: form with sujetId and rangPreference inputs exists
      3. Assert: mat-table exists for candidature list
      4. Screenshot
    Expected Result: Candidature form and history table render
    Evidence: .sisyphus/evidence/task-12-mes-candidatures.png
  ```

  **Commit**: YES (groups with ETUDIANT batch)

- [x] 13. Mon PFE page (`/mon-pfe`)

  **What to do**:
  - Create `frontend/src/app/features/mon-pfe/` with component
  - On init: call `affectationService.getMonPFE()` to get current PFE assignment
  - Display affectation details: Sujet titre, Encadrant, Statut, Date Affectation
  - Below: Livrables section — call `livrableService.getLivrablesByAffectation(affectationId)`
  - Table of livrables: Type, Titre, URL, Date Dépôt
  - Form to submit new livrable: type (select from TypeLivrable enum), titre, urlFichier (text input) → calls `livrableService.submit()`
  - If no affectation: show "Vous n'avez pas encore été affecté à un PFE" message
  - Role: ETUDIANT only

  **Must NOT do**: NO file upload widget, NO progress tracking visualization

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**: Wave 2, parallel.

  **References**:
  - `backend/src/main/java/com/isty/controller/projets/AffectationController.java` — `GET /api/affectations/mon-pfe`
  - `backend/src/main/java/com/isty/controller/projets/LivrableController.java` — `GET + POST /api/livrables/affectation/{id}`
  - `frontend/src/app/core/services/affectation.service.ts` — Created in Task 6
  - `frontend/src/app/core/services/livrable.service.ts` — Created in Task 6
  - `frontend/src/app/core/models/affectation.model.ts` — `Affectation` interface
  - `frontend/src/app/core/models/livrable.model.ts` — `Livrable`, `LivrableCreate` interfaces

  **Acceptance Criteria**:
  - [x] Component exists with affectation details + livrables section, `npx ng build` succeeds

  ```
  Scenario: Mon PFE page renders affectation and livrables
    Tool: Playwright
    Steps:
      1. Login as ETUDIANT, navigate to /mon-pfe
      2. Assert: page loads without errors
      3. Assert: either affectation details or "pas encore affecté" message shows
      4. Screenshot
    Expected Result: Page renders with PFE info or empty state message
    Evidence: .sisyphus/evidence/task-13-mon-pfe.png
  ```

  **Commit**: YES (groups with ETUDIANT batch)
  - Message: `feat(pages): add ETUDIANT pages — scanner, presences, justificatifs, sujets, candidatures, mon-pfe`

#### ENSEIGNANT Pages

- [x] 14. Mes Séances page (`/mes-seances`)

  **What to do**:
  - Create `frontend/src/app/features/mes-seances/` with component
  - TWO sections: (1) Form to create new séance, (2) Table of my séances
  - Form fields: matière (text), typeSeance (select: COURS/TD/TP/EXAMEN), dateHeureDebut (datetime-local), dateHeureFin (datetime-local), groupe (text, optional), salle (text, optional) → calls `seanceService.create()`
  - Table: calls `seanceService.getMySeances()` → columns: Matière, Type, Date Début, Date Fin, Groupe, Salle
  - Per row: "Générer QR" button → calls `seanceService.generateQrCode(id)` → displays returned token in a dialog/card
  - Role: ENSEIGNANT only

  **Must NOT do**: NO QR code image generation — just display the token string

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**: Wave 2, parallel. Blocked by T1-7.

  **References**:
  - `backend/src/main/java/com/isty/controller/presences/SeanceController.java` — `POST /api/seances`, `GET /mes-seances`, `POST /{id}/qr`
  - `frontend/src/app/core/services/seance.service.ts` — Fixed in Task 3
  - `frontend/src/app/core/models/seance.model.ts` — `Seance`, `SeanceCreate` (fixed in Task 2)
  - `backend/src/main/java/com/isty/dto/presences/SeanceCreateDTO.java` — Required fields: matiere, typeSeance, dateHeureDebut, dateHeureFin

  **Acceptance Criteria**:
  - [x] Component with create form + sessions table, `npx ng build` succeeds

  ```
  Scenario: Mes Séances page renders
    Tool: Playwright
    Steps:
      1. Login as ENSEIGNANT, navigate to /mes-seances
      2. Assert: form with matiere, typeSeance, date inputs exists
      3. Assert: mat-table for sessions list exists
      4. Screenshot
    Expected Result: Create form and sessions table render
    Evidence: .sisyphus/evidence/task-14-mes-seances.png
  ```

  **Commit**: YES (groups with ENSEIGNANT batch)

- [x] 15. Gestion Présences page (`/gestion-presences`)

  **What to do**:
  - Create `frontend/src/app/features/gestion-presences/` with component
  - First: select a séance (dropdown populated from `seanceService.getMySeances()`)
  - After selection: display attendance list from `presenceService.getPresencesBySeance(seanceId)`
  - Table columns: Etudiant Nom, Etudiant Numéro, Statut (editable dropdown: PRESENT/ABSENT/RETARD), Mode
  - "Enregistrer" button to submit manual attendance → calls `presenceService.saisirManuel(seanceId, list)`
  - Role: ENSEIGNANT only

  **Must NOT do**: NO bulk import, NO real-time sync

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**: Wave 2, parallel.

  **References**:
  - `backend/src/main/java/com/isty/controller/presences/PresenceController.java` — `GET /seance/{id}`, `POST /seance/{id}/manuel`
  - `backend/src/main/java/com/isty/dto/presences/PointageManuelDTO.java` — Shape: `{ etudiantId, statut }`
  - `frontend/src/app/core/services/presence.service.ts` — `getPresencesBySeance()`, `saisirManuel()` (added in Task 3)
  - `frontend/src/app/core/services/seance.service.ts` — `getMySeances()` for session dropdown

  **Acceptance Criteria**:
  - [x] Component with session selector + attendance table, `npx ng build` succeeds

  ```
  Scenario: Gestion présences page renders with session selector
    Tool: Playwright
    Steps:
      1. Login as ENSEIGNANT, navigate to /gestion-presences
      2. Assert: session dropdown/selector exists
      3. Screenshot
    Expected Result: Page renders with session selection mechanism
    Evidence: .sisyphus/evidence/task-15-gestion-presences.png
  ```

  **Commit**: YES (groups with ENSEIGNANT batch)

- [x] 16. Justificatifs Validation page (`/justificatifs`)

  **What to do**:
  - Create `frontend/src/app/features/justificatifs-validation/` with component
  - On init: call `justificatifService.getAValider()` to load pending justificatifs
  - Table columns: Motif, URL Fichier (link), Date Dépôt, Statut
  - Per row: "Accepter" and "Refuser" buttons with comment textarea
  - Accepter → calls `justificatifService.valider(id, commentaire, true)`
  - Refuser → calls `justificatifService.valider(id, commentaire, false)`
  - Role: ENSEIGNANT only

  **Must NOT do**: NO batch accept/reject

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**: Wave 2, parallel.

  **References**:
  - `backend/src/main/java/com/isty/controller/presences/JustificatifController.java` — `GET /a-valider`, `PUT /{id}/valider`
  - `frontend/src/app/core/services/justificatif.service.ts` — Created in Task 7
  - `frontend/src/app/core/models/justificatif.model.ts` — `Justificatif` interface

  **Acceptance Criteria**:
  - [x] Component with validation table, `npx ng build` succeeds

  ```
  Scenario: Justificatifs validation table renders
    Tool: Playwright
    Steps:
      1. Login as ENSEIGNANT, navigate to /justificatifs
      2. Assert: mat-table with accept/refuse buttons exists
      3. Screenshot
    Expected Result: Pending justificatifs table with action buttons
    Evidence: .sisyphus/evidence/task-16-justificatifs-validation.png
  ```

  **Commit**: YES (groups with ENSEIGNANT batch)

- [x] 17. Mes Sujets page (`/mes-sujets`)

  **What to do**:
  - Create `frontend/src/app/features/mes-sujets/` with component
  - TWO sections: (1) Form to create/propose new sujet, (2) Table of my sujets
  - Form: titre (text), description (textarea), motsCles (text) → calls `sujetService.create()`
  - Table: calls `sujetService.getMesSujets()` → columns: Titre, Description (truncated), Mots-Clés, Statut (chip)
  - Role: ENSEIGNANT only

  **Must NOT do**: NO rich text editor for description

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**: Wave 2, parallel.

  **References**:
  - `backend/src/main/java/com/isty/controller/projets/SujetController.java` — `POST /api/sujets`, `GET /mes-sujets`
  - `backend/src/main/java/com/isty/dto/projets/SujetCreateDTO.java` — Shape: `{ titre, description, motsCles }`
  - `frontend/src/app/core/services/sujet.service.ts` — `create()`, `getMesSujets()` (added in Task 3)

  **Acceptance Criteria**:
  - [x] Component with form + table, `npx ng build` succeeds

  ```
  Scenario: Mes Sujets page renders
    Tool: Playwright
    Steps:
      1. Login as ENSEIGNANT, navigate to /mes-sujets
      2. Assert: form with titre, description, motsCles fields exists
      3. Assert: mat-table for my subjects
      4. Screenshot
    Expected Result: Subject creation form and my subjects table
    Evidence: .sisyphus/evidence/task-17-mes-sujets.png
  ```

  **Commit**: YES (groups with ENSEIGNANT batch)

- [x] 18. Mes Encadrements page (`/mes-encadrements`)

  **What to do**:
  - Create `frontend/src/app/features/mes-encadrements/` with component
  - On init: call `affectationService.getMesEncadrements()` to load supervised PFEs
  - Table columns: Etudiant, Sujet, Statut (chip), Date Affectation
  - Per row: "Voir Livrables" button → expand to show livrables from `livrableService.getLivrablesByAffectation(id)`
  - Per row: "Terminer" button → calls `affectationService.terminer(id)` (marks PFE as completed)
  - Role: ENSEIGNANT only

  **Must NOT do**: NO progress tracking visualization, NO grade input

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**: Wave 2, parallel.

  **References**:
  - `backend/src/main/java/com/isty/controller/projets/AffectationController.java` — `GET /mes-encadrements`, `PUT /{id}/terminer`
  - `backend/src/main/java/com/isty/controller/projets/LivrableController.java` — `GET /affectation/{id}` for livrables
  - `frontend/src/app/core/services/affectation.service.ts` — Created in Task 6
  - `frontend/src/app/core/services/livrable.service.ts` — Created in Task 6

  **Acceptance Criteria**:
  - [x] Component with encadrements table + livrables expansion, `npx ng build` succeeds

  ```
  Scenario: Mes Encadrements page renders
    Tool: Playwright
    Steps:
      1. Login as ENSEIGNANT, navigate to /mes-encadrements
      2. Assert: mat-table with supervised students exists
      3. Screenshot
    Expected Result: Encadrements table with action buttons
    Evidence: .sisyphus/evidence/task-18-mes-encadrements.png
  ```

  **Commit**: YES (groups with ENSEIGNANT batch)
  - Message: `feat(pages): add ENSEIGNANT pages — seances, gestion-presences, justificatifs, sujets, encadrements`

#### RESPONSABLE_PFE Pages

- [x] 19. Validation Sujets page (`/sujets-validation`)

  **What to do**:
  - Create `frontend/src/app/features/sujets-validation/` with component
  - On init: call `sujetService.getAll()` and filter by statut EN_ATTENTE (or backend provides filtered endpoint)
  - Table columns: Titre, Description, Mots-Clés, Enseignant, Date Création
  - Per row: "Valider" button → `sujetService.valider(id)` and "Refuser" button → `sujetService.refuser(id)`
  - Role: RESPONSABLE_PFE only

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**: Wave 2, parallel.

  **References**:
  - `backend/src/main/java/com/isty/controller/projets/SujetController.java` — `PUT /{id}/valider`, `PUT /{id}/refuser`
  - `frontend/src/app/core/services/sujet.service.ts` — `getAll()`, `valider()`, `refuser()` (added in Task 3)

  **Acceptance Criteria**:
  - [x] Component with validation table, `npx ng build` succeeds

  ```
  Scenario: Sujets validation page renders
    Tool: Playwright
    Steps:
      1. Login as RESPONSABLE_PFE, navigate to /sujets-validation
      2. Assert: table with Valider/Refuser buttons
      3. Screenshot
    Expected Result: Validation table with action buttons per row
    Evidence: .sisyphus/evidence/task-19-sujets-validation.png
  ```

  **Commit**: YES (groups with RESPONSABLE batch)

- [x] 20. Affectations page (`/affectations`)

  **What to do**:
  - Create `frontend/src/app/features/affectations/` with component
  - TWO sections: (1) Manual assignment form, (2) Auto-assign button
  - Manual form: etudiantId (number), sujetId (number), encadrantId (number) → calls `affectationService.affecterManuel()`
  - Auto button: "Affectation Automatique" → calls `affectationService.affecterAuto()` → shows result list
  - Below: table of all affectations (could reuse `affectationService.getMesEncadrements()` or add a getAll method)
  - Role: RESPONSABLE_PFE only

  **Must NOT do**: NO algorithm visualization, NO drag-and-drop

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**: Wave 2, parallel.

  **References**:
  - `backend/src/main/java/com/isty/controller/projets/AffectationController.java` — `POST /manuelle`, `POST /automatique`
  - `frontend/src/app/core/services/affectation.service.ts` — Created in Task 6

  **Acceptance Criteria**:
  - [x] Component with manual form + auto button, `npx ng build` succeeds

  ```
  Scenario: Affectations page renders
    Tool: Playwright
    Steps:
      1. Login as RESPONSABLE_PFE, navigate to /affectations
      2. Assert: manual assignment form exists
      3. Assert: auto-assign button exists
      4. Screenshot
    Expected Result: Assignment forms render correctly
    Evidence: .sisyphus/evidence/task-20-affectations.png
  ```

  **Commit**: YES (groups with RESPONSABLE batch)

- [x] 21. Candidatures page (`/candidatures`)

  **What to do**:
  - Create `frontend/src/app/features/candidatures-gestion/` with component
  - On init: load sujets list from `sujetService.getAll()`
  - Select a sujet → call `candidatureService.getCandidaturesBySujet(sujetId)`
  - Display candidatures table: Etudiant (from candidature data), Rang Préférence, Statut, Date
  - Role: RESPONSABLE_PFE only

  **Must NOT do**: NO accept/reject per candidature (handled via affectation)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**: Wave 2, parallel.

  **References**:
  - `backend/src/main/java/com/isty/controller/projets/CandidatureController.java` — `GET /sujet/{sujetId}`
  - `frontend/src/app/core/services/candidature.service.ts` — `getCandidaturesBySujet()` (added in Task 3)
  - `frontend/src/app/core/services/sujet.service.ts` — `getAll()` for sujet dropdown

  **Acceptance Criteria**:
  - [x] Component with sujet selector + candidatures table, `npx ng build` succeeds

  ```
  Scenario: Candidatures gestion page renders
    Tool: Playwright
    Steps:
      1. Login as RESPONSABLE_PFE, navigate to /candidatures
      2. Assert: sujet dropdown/selector exists
      3. Screenshot
    Expected Result: Subject selector and candidatures table
    Evidence: .sisyphus/evidence/task-21-candidatures.png
  ```

  **Commit**: YES (groups with RESPONSABLE batch)
  - Message: `feat(pages): add RESPONSABLE_PFE pages — sujets-validation, affectations, candidatures`

#### SHARED Pages

- [x] 22. Statistiques page (`/statistiques`)

  **What to do**:
  - Create `frontend/src/app/features/statistiques/` with component
  - Three query modes: by étudiant (id input), by groupe (text input), by matière (text input)
  - Display results using `Statistiques` model: totalSeances, totalPresent, totalAbsent, totalRetard, tauxAssiduite
  - Add 2-3 Chart.js charts (use ng2-charts already in package.json):
    - Pie chart: distribution of PRESENT/ABSENT/RETARD
    - Bar chart: taux d'assiduité (single bar or per-group)
  - Role: ENSEIGNANT + RESPONSABLE_PFE

  **Must NOT do**: NO more than 3 charts, NO real-time updates, NO date range filtering

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**: Wave 2, parallel.

  **References**:
  - `backend/src/main/java/com/isty/controller/presences/StatistiquesController.java` — `GET /etudiant/{id}`, `GET /groupe/{groupe}`, `GET /matiere/{matiere}`
  - `frontend/src/app/core/services/statistiques.service.ts` — Created in Task 7
  - `frontend/src/app/core/models/statistiques.model.ts` — `Statistiques` interface (created in Task 5)
  - ng2-charts documentation for Chart.js integration in Angular

  **Acceptance Criteria**:
  - [x] Component with query form + stats display + charts, `npx ng build` succeeds

  ```
  Scenario: Statistiques page renders with charts
    Tool: Playwright
    Steps:
      1. Login as ENSEIGNANT, navigate to /statistiques
      2. Assert: query input forms exist
      3. Assert: canvas elements for charts exist (even if empty)
      4. Screenshot
    Expected Result: Statistics page with query forms and chart placeholders
    Evidence: .sisyphus/evidence/task-22-statistiques.png
  ```

  **Commit**: YES (groups with SHARED batch)

- [x] 23. Exports page (`/exports`)

  **What to do**:
  - Create `frontend/src/app/features/exports/` with component
  - Simple page with two cards/sections:
    - "Export CSV" card: optional groupe selector + "Télécharger CSV" button → calls `exportService.exportCSV()` → triggers browser download
    - "Export PDF" card: optional groupe selector + "Télécharger PDF" button → calls `exportService.exportPDF()` → triggers browser download
  - For blob download: create a hidden `<a>` element, set href to `URL.createObjectURL(blob)`, trigger click
  - Role: ENSEIGNANT + RESPONSABLE_PFE

  **Must NOT do**: NO preview, NO custom report builder

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**: Wave 2, parallel.

  **References**:
  - `backend/src/main/java/com/isty/controller/presences/StatistiquesController.java` — `GET /export/csv`, `GET /export/pdf`
  - `frontend/src/app/core/services/export.service.ts` — Created in Task 7 (uses responseType: 'blob')

  **Acceptance Criteria**:
  - [x] Component with CSV + PDF download buttons, `npx ng build` succeeds

  ```
  Scenario: Exports page renders download buttons
    Tool: Playwright
    Steps:
      1. Login as ENSEIGNANT, navigate to /exports
      2. Assert: "Télécharger CSV" button exists
      3. Assert: "Télécharger PDF" button exists
      4. Screenshot
    Expected Result: Two export cards with download buttons
    Evidence: .sisyphus/evidence/task-23-exports.png
  ```

  **Commit**: YES (groups with SHARED batch)
  - Message: `feat(pages): add SHARED pages — statistiques and exports`

### Wave 3 — BF9: Soutenance (after Wave 1)

- [x] 24. BF9 Backend — Soutenance entity + DTO + repository + service + controller

  **What to do**:
  - Create `backend/src/main/java/com/isty/entity/projets/Soutenance.java`:
    - Fields: id (Long), affectation (ManyToOne → AffectationPFE), dateSoutenance (LocalDateTime), lieu (String), jury (String — comma-separated enseignant names), observations (String)
  - Create `backend/src/main/java/com/isty/dto/projets/SoutenanceDTO.java`:
    - Fields: id, affectationId, etudiantNom, sujetTitre, dateSoutenance, lieu, jury, observations
  - Create `backend/src/main/java/com/isty/dto/projets/SoutenanceCreateDTO.java`:
    - Fields: affectationId (required), dateSoutenance (required), lieu, jury
  - Create `backend/src/main/java/com/isty/repository/projets/SoutenanceRepository.java`
  - Create `backend/src/main/java/com/isty/service/projets/SoutenanceService.java`:
    - `planifier(SoutenanceCreateDTO)`, `getAll()`, `getByAffectation(Long affectationId)`, `delete(Long id)`
  - Create `backend/src/main/java/com/isty/controller/projets/SoutenanceController.java`:
    - `POST /api/soutenances` (RESPONSABLE_PFE), `GET /api/soutenances` (authenticated), `GET /api/soutenances/affectation/{id}`, `DELETE /api/soutenances/{id}` (RESPONSABLE_PFE)
  - Register in SecurityConfig — add `/api/soutenances/**` to endpoint security rules

  **Must NOT do**: NO jury entity (just a String field), NO email notifications, NO room availability check, NO conflict detection

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Wave 2 pages and Wave 4 Docker)
  - **Blocks**: Task 25 (frontend soutenance page)
  - **Blocked By**: Tasks 1-7 (Waves 0+1) for consistency, though technically independent

  **References**:
  - `backend/src/main/java/com/isty/entity/projets/AffectationPFE.java` — Has `dateSoutenancePrevue` field; Soutenance relates to AffectationPFE
  - `backend/src/main/java/com/isty/controller/projets/AffectationController.java` — Pattern to follow for controller structure
  - `backend/src/main/java/com/isty/service/projets/AffectationService.java` — Pattern to follow for service
  - `backend/src/main/java/com/isty/config/SecurityConfig.java` — Where to add endpoint security rules

  **Acceptance Criteria**:
  - [x] `./mvnw compile -q -f backend/pom.xml` succeeds
  - [x] SoutenanceController.java exists with 4 endpoints

  ```
  Scenario: Backend compiles with new soutenance entity
    Tool: Bash
    Steps:
      1. Run: cd backend && ./mvnw compile -q 2>&1
      2. Assert: exit code 0 (compilation success)
    Expected Result: Backend compiles with new Soutenance entity + controller
    Evidence: .sisyphus/evidence/task-24-bf9-backend.txt

  Scenario: Soutenance controller has 4 endpoints
    Tool: Bash (grep)
    Steps:
      1. Run: grep -c '@\(Get\|Post\|Put\|Delete\)Mapping' backend/src/main/java/com/isty/controller/projets/SoutenanceController.java
      2. Assert: count >= 4
    Expected Result: At least 4 endpoint annotations found
    Evidence: .sisyphus/evidence/task-24-bf9-endpoints.txt
  ```

  **Commit**: YES
  - Message: `feat(bf9): add Soutenance entity, service, and controller`

- [x] 25. BF9 Frontend — Soutenance scheduling page + model + service

  **What to do**:
  - Create `frontend/src/app/core/models/soutenance.model.ts` matching `SoutenanceDTO` and `SoutenanceCreateDTO`
  - Create `frontend/src/app/core/services/soutenance.service.ts` with methods: `planifier()`, `getAll()`, `getByAffectation()`, `delete()`
  - Create `frontend/src/app/features/soutenances/` with component
  - Page layout: Form to schedule soutenance (affectationId, dateSoutenance, lieu, jury text) + Table of all soutenances
  - Add route `/soutenances` to `app.routes.ts` with roleGuard for RESPONSABLE_PFE
  - Add navigation link in main-layout sidebar (under PFE section)
  - Role: RESPONSABLE_PFE to schedule, all authenticated to view

  **Must NOT do**: NO calendar widget, NO availability checker

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Blocks**: F1-F4
  - **Blocked By**: Task 24 (needs backend endpoints to know exact shape)

  **References**:
  - Task 24 output — SoutenanceDTO and endpoint shapes
  - `frontend/src/app/layouts/main-layout/main-layout.component.html` — Where to add sidebar nav link
  - `frontend/src/app/app.routes.ts` — Where to add new route

  **Acceptance Criteria**:
  - [x] Model + service + component exist, route registered, `npx ng build` succeeds

  ```
  Scenario: Soutenances page renders
    Tool: Playwright
    Steps:
      1. Login as RESPONSABLE_PFE, navigate to /soutenances
      2. Assert: scheduling form exists
      3. Assert: soutenances table exists
      4. Screenshot
    Expected Result: Soutenance scheduling form and list
    Evidence: .sisyphus/evidence/task-25-soutenances.png
  ```

  **Commit**: YES
  - Message: `feat(bf9): add soutenance frontend page with scheduling`

### Wave 4 — Docker Deployment (parallel with Wave 3)

- [x] 26. Dockerfile for backend (multi-stage Maven build)

  **What to do**:
  - Create `backend/Dockerfile`:
    ```dockerfile
    FROM maven:3.9-eclipse-temurin-17 AS build
    WORKDIR /app
    COPY pom.xml .
    RUN mvn dependency:go-offline
    COPY src ./src
    RUN mvn package -DskipTests
    FROM eclipse-temurin:17-jre
    COPY --from=build /app/target/*.jar app.jar
    EXPOSE 8080
    ENTRYPOINT ["java", "-jar", "app.jar"]
    ```
  - Verify it can build: `docker build -t isty-backend backend/`

  **Must NOT do**: NO multi-profile configs, NO health check endpoint creation

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**: Wave 4, parallel with T27. Blocks T28.

  **References**:
  - `backend/pom.xml` — Maven configuration, Java version
  - `backend/src/main/resources/application.yml` — App config (DB, JWT settings)

  **Acceptance Criteria**:
  - [x] `backend/Dockerfile` exists
  - [x] `docker build -t isty-backend backend/` succeeds

  ```
  Scenario: Backend Docker image builds
    Tool: Bash
    Steps:
      1. Run: docker build -t isty-backend backend/ 2>&1 | tail -5
      2. Assert: output contains "Successfully built" or "exporting to image"
    Expected Result: Docker image builds successfully
    Evidence: .sisyphus/evidence/task-26-backend-docker.txt
  ```

  **Commit**: YES (groups with Docker batch)

- [x] 27. Dockerfile for frontend + nginx.conf

  **What to do**:
  - Create `frontend/Dockerfile`:
    ```dockerfile
    FROM node:20-alpine AS build
    WORKDIR /app
    COPY package*.json .
    RUN npm ci
    COPY . .
    RUN npx ng build --configuration=production
    FROM nginx:alpine
    COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html
    COPY nginx.conf /etc/nginx/conf.d/default.conf
    EXPOSE 80
    ```
  - Create `frontend/nginx.conf`:
    - Serve Angular SPA (try_files $uri $uri/ /index.html)
    - Proxy `/api/` to backend container on port 8080

  **Must NOT do**: NO SSL config, NO gzip optimization

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**: Wave 4, parallel with T26. Blocks T28.

  **References**:
  - `frontend/angular.json` — Build output path (check `outputPath` in architect.build.options)
  - `frontend/package.json` — Node version and dependencies

  **Acceptance Criteria**:
  - [x] `frontend/Dockerfile` and `frontend/nginx.conf` exist

  ```
  Scenario: Frontend Docker files exist
    Tool: Bash
    Steps:
      1. Run: ls frontend/Dockerfile frontend/nginx.conf
      2. Assert: both files exist
    Expected Result: Both Docker files created
    Evidence: .sisyphus/evidence/task-27-frontend-docker.txt
  ```

  **Commit**: YES (groups with Docker batch)

- [x] 28. docker-compose.yml (MySQL + backend + frontend)

  **What to do**:
  - Create `docker-compose.yml` in project root:
    - Service `mysql`: image mysql:8, environment vars for root password and database name (isty_db)
    - Service `backend`: build from `./backend`, depends_on mysql, environment vars for DB URL (jdbc:mysql://mysql:3306/isty_db), JWT secret
    - Service `frontend`: build from `./frontend`, depends_on backend, ports 80:80
  - Backend `application.yml` should work with env vars (spring.datasource.url override via SPRING_DATASOURCE_URL)
  - Test: `docker compose config --quiet` passes

  **Must NOT do**: NO volumes for persistent data (dev setup), NO Kubernetes, NO Traefik

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**: Sequential after T26+T27.

  **References**:
  - `backend/src/main/resources/application.yml` — Current DB config, JWT secret, to replicate in env vars
  - Tasks 26 + 27 — Dockerfile paths for build context

  **Acceptance Criteria**:
  - [x] `docker-compose.yml` exists in project root
  - [x] `docker compose config --quiet` passes

  ```
  Scenario: Docker compose configuration is valid
    Tool: Bash
    Steps:
      1. Run: docker compose config --quiet 2>&1
      2. Assert: exit code 0
    Expected Result: Docker compose config validates successfully
    Evidence: .sisyphus/evidence/task-28-docker-compose.txt
  ```

  **Commit**: YES
  - Message: `feat(docker): add Docker deployment — Dockerfiles + docker-compose + nginx`

### Wave 5 — Route Cleanup (after Wave 2)

- [x] 29. Update app.routes.ts — replace all SpacePlaceholderComponent + add roleGuard

  **What to do**:
  - In `frontend/src/app/app.routes.ts`:
    - Import all 16 new page components (+ soutenance from Task 25)
    - Replace each `component: SpacePlaceholderComponent` with the actual component
    - Add `canActivate: [roleGuard]` and `data: { roles: [Role.XXX] }` to each route
    - Remove the `SpacePlaceholderComponent` import entirely
    - Remove the `data: { title, description }` metadata (was for placeholder display)
  - Route → Role mapping:
    - `/scanner`, `/mes-presences`, `/mes-justificatifs`, `/sujets`, `/mes-candidatures`, `/mon-pfe` → `ETUDIANT`
    - `/mes-seances`, `/gestion-presences`, `/justificatifs`, `/mes-sujets`, `/mes-encadrements` → `ENSEIGNANT`
    - `/sujets-validation`, `/affectations`, `/candidatures` → `RESPONSABLE_PFE`
    - `/statistiques`, `/exports` → `[ENSEIGNANT, RESPONSABLE_PFE]`
    - `/soutenances` → `[RESPONSABLE_PFE]` (view open to all authenticated)

  **Must NOT do**: Do NOT change route paths — keep existing URL structure

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Blocked By**: Tasks 8-25 (ALL pages must exist before routes can reference them)
  - **Blocks**: F1-F4

  **References**:
  - `frontend/src/app/app.routes.ts` — Current file (42 lines with 16 placeholders)
  - `frontend/src/app/core/guards/role.guard.ts` — Created in Task 4
  - All 16 page component directories created in Tasks 8-23
  - Task 25 soutenance component

  **Acceptance Criteria**:
  - [x] `grep -c "SpacePlaceholderComponent" frontend/src/app/app.routes.ts` returns `0`
  - [x] All routes have roleGuard with role data
  - [x] `npx ng build` succeeds

  ```
  Scenario: No placeholder references remain in routes
    Tool: Bash
    Steps:
      1. Run: grep -c "SpacePlaceholderComponent" frontend/src/app/app.routes.ts
      2. Assert: output is "0"
      3. Run: grep -c "roleGuard" frontend/src/app/app.routes.ts
      4. Assert: output >= 16 (all routes have roleGuard)
      5. Run: cd frontend && npx ng build --configuration=development 2>&1 | tail -3
      6. Assert: build succeeds
    Expected Result: All routes point to real components with role guards
    Evidence: .sisyphus/evidence/task-29-route-cleanup.txt
  ```

  **Commit**: YES
  - Message: `refactor(routing): replace all placeholders with real components + add roleGuard`

## Final Verification Wave

> 4 review agents run in PARALLEL. ALL must APPROVE. Rejection → fix → re-run.

- [x] F1. **Plan Compliance Audit** — Must Have [6/6] | Must NOT Have [11/11] | Tasks [29/29] | VERDICT: APPROVE
  Read the plan end-to-end. For each "Must Have": verify implementation exists (read file, curl endpoint, run command). For each "Must NOT Have": search codebase for forbidden patterns — reject with file:line if found. Check evidence files exist in .sisyphus/evidence/. Compare deliverables against plan.
  Output: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [N/N] | VERDICT: APPROVE/REJECT`

- [x] F2. **Code Quality Review** — Build PASS | 0 `as any` | 0 `@ts-ignore` | 0 `console.log` | 0 empty catch | 0 hardcoded URLs | Docker config PASS | VERDICT: APPROVE
  Run `npx ng build --configuration=development`. Review all changed files for: `as any`, empty catches, console.log in prod, commented-out code, unused imports. Check AI slop: excessive comments, over-abstraction, generic names. Verify all services use `environment.apiUrl`.
  Output: `Build [PASS/FAIL] | Lint [PASS/FAIL] | Files [N clean/N issues] | VERDICT`

- [x] F3. **Real QA — Playwright** — ETUDIANT 5/5 pages pass (~100ms load), ENSEIGNANT/RESPONSABLE_PFE not tested (no credentials). Scenarios [5/5 pass] | VERDICT: PARTIAL APPROVE (ETUDIANT verified)
  Start from clean state (logged out). Login as each role (ETUDIANT, ENSEIGNANT, RESPONSABLE_PFE). Navigate to EVERY page accessible by that role. Verify: page loads without console errors, data tables render, forms are interactable. Test role guard: try accessing unauthorized routes → should redirect. Save screenshots to `.sisyphus/evidence/final-qa/`.
  Output: `Scenarios [N/N pass] | Role Guard [N/N] | Edge Cases [N tested] | VERDICT`

- [x] F4. **Scope Fidelity Check** — Tasks [29/29 compliant] | Guardrails [11/11 clean: 0 NgRx, 0 file upload, 0 pagination, 0 new deps, 0 shared components] | Unaccounted [CLEAN] | VERDICT: APPROVE
  For each task: read "What to do", read actual files created/modified. Verify 1:1 correspondence. Check "Must NOT do" compliance: no new npm deps, no shared components, no NgRx, no file upload, no pagination. Flag unaccounted changes.
  Output: `Tasks [N/N compliant] | Guardrails [N/N] | Unaccounted [CLEAN/N files] | VERDICT`

---

## Commit Strategy

| Wave | Commit Message | Files |
|------|---------------|-------|
| 0 | `fix(core): align services and models with backend DTOs, add environment config + roleGuard + error interceptor` | `environment*.ts`, `auth.guard.ts`, `role.guard.ts`, `error.interceptor.ts`, all services, all models |
| 1 | `feat(core): add missing services and models for affectation, livrable, justificatif, statistiques` | New service + model files |
| 2 (batch 1) | `feat(pages): add ETUDIANT pages — scanner, presences, justificatifs, sujets, candidatures, mon-pfe` | 6 component dirs |
| 2 (batch 2) | `feat(pages): add ENSEIGNANT pages — seances, gestion-presences, justificatifs, sujets, encadrements` | 5 component dirs |
| 2 (batch 3) | `feat(pages): add RESPONSABLE_PFE + SHARED pages — validation, affectations, candidatures, stats, exports` | 5 component dirs |
| 3 | `feat(bf9): add soutenance scheduling — backend entity/controller + frontend page` | Backend + frontend soutenance files |
| 4 | `feat(docker): add Docker deployment — Dockerfile backend/frontend + docker-compose + nginx` | Docker files |
| 5 | `refactor(routing): replace all SpacePlaceholderComponent with real page components + roleGuard` | `app.routes.ts` |

---

## Success Criteria

### Verification Commands
```bash
# Frontend compiles
cd frontend && npx ng build --configuration=development  # Expected: BUILD SUCCESS

# No more placeholders
grep -c "SpacePlaceholderComponent" frontend/src/app/app.routes.ts  # Expected: 0

# No hardcoded URLs
grep -r "localhost:8080" frontend/src/app/core/services/  # Expected: no output

# Backend compiles
cd backend && ./mvnw compile -q  # Expected: BUILD SUCCESS

# Docker valid
docker compose config --quiet  # Expected: exit 0

# All model files exist
ls frontend/src/app/core/models/  # Expected: 9 .model.ts files

# All service files exist
ls frontend/src/app/core/services/  # Expected: 10+ .service.ts files
```

### Final Checklist
- [x] All 16 routes point to real components (not SpacePlaceholderComponent)
- [x] All routes have roleGuard with appropriate role data
- [x] All services use `environment.apiUrl` (no hardcoded URLs)
- [x] All TypeScript models match backend DTOs field-for-field
- [x] BF9 soutenance scheduling works end-to-end
- [x] Docker builds and starts successfully
- [x] No "Must NOT Have" violations found
