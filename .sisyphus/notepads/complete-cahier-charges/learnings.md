# Learnings — complete-cahier-charges

## [2026-03-01] Session ses_35998310dffe2Cd2yEE2Yutbii — Initial Setup

### Tech Stack
- Angular 21 (standalone components), Angular Material 21.1.4
- Spring Boot backend, JPA/Hibernate, JWT, MySQL
- No Xcode license — git commands blocked on this machine
- Working directly in main project directory (no worktree)

### Brand / Design
- Primary: `$burgundy: #6d1d4a`, `$teal: #0097c4`, `$burgundy-dark: #4a1233`
- Font: Inter (Google Fonts, already imported)
- Style: "un site d'école bien slick" — professional academic look

### Project Structure
- Frontend: `/Users/hatimbenzahra/Desktop/Me/isty-pfe-absences/frontend/src/app/`
  - Core: `core/services/`, `core/models/`, `core/guards/`
  - Features: `features/{name}/`
  - Layouts: `layouts/main-layout/`
- Backend: `/Users/hatimbenzahra/Desktop/Me/isty-pfe-absences/backend/src/main/java/com/isty/`
  - Controllers: `controller/{presences,projets,user}/`
  - DTOs: `dto/{presences,projets,user}/`
  - Entities: `entity/{presences,projets,user}/`

### Service Pattern (existing, correct)
```typescript
@Injectable({ providedIn: 'root' })
export class XxxService {
  private apiUrl = `${environment.apiUrl}/xxx`;
  constructor(private http: HttpClient) {}
  method(): Observable<T> { return this.http.get<T>(`${this.apiUrl}/path`); }
}
```

### Model Pattern — Mirror backend DTOs EXACTLY (field names must match)
- Do NOT rename fields (e.g., `horodatage` not `timestamp`, `tokenQR` not `qrToken`)

### Auth Pattern
- JWT in localStorage key `'token'`
- `authService.hasRole(role)` available for role checks
- `authService.isAuthenticated()` for simple auth check

### Angular Component Pattern
- Standalone components (`standalone: true`)
- External HTML + SCSS files (unless very small — see dashboard for inline)
- Use `inject()` in constructor or field injection
- Import Material modules directly in component `imports: []`

## Model Synchronization with Backend DTOs (Completed)

### Changes Made
1. **presence.model.ts** - Completely rewritten
   - Removed: `seanceId`, `etudiantId`, `datePointage`
   - Added: `etudiantNom`, `etudiantNumero`, `modeSaisie`, `horodatage`, `aJustificatif`
   - Added enums: `ModeSaisie` (QR, MANUEL)
   - Added interfaces: `PointageQRRequest` (tokenQR), `PointageManuelRequest` (etudiantId, statut)

2. **seance.model.ts** - Completely rewritten
   - Renamed: `type` → `typeSeance`
   - Renamed: `dateDebut` → `dateHeureDebut`, `dateFin` → `dateHeureFin`
   - Changed types: Date → string (for datetime fields)
   - Removed: `qrCodeToken`
   - Added: `groupe` field
   - Updated SeanceCreate: removed `groupeId`, added `groupe` and `salle` as optional

3. **candidature.model.ts** - Minor fix
   - Changed: `dateCandidature: Date` → `dateCandidature: string`

4. **sujet.model.ts** - Minor fix
   - Changed: `dateCreation: Date` → `dateCreation: string`

5. **user.model.ts** - No changes needed (already correct)

### Backend DTO Verification
- PresenceDTO: id, etudiantNom, etudiantNumero, statut, modeSaisie, horodatage, aJustificatif ✓
- PointageQRDTO: tokenQR ✓
- PointageManuelDTO: etudiantId, statut ✓
- SeanceDTO: id, matiere, typeSeance, dateHeureDebut, dateHeureFin, groupe, salle, enseignantNom ✓
- SeanceCreateDTO: matiere, typeSeance, dateHeureDebut, dateHeureFin, groupe?, salle? ✓
- CandidatureDTO: id, sujetId, sujetTitre, rangPreference, statut, dateCandidature ✓
- SujetDTO: id, titre, description, motsCles, statut, enseignantNom, dateCreation ✓
- UserDTO: id, nom, prenom, email, role ✓

### Build Status
- Angular build (development): ✓ PASSED
- No TypeScript errors
- Only SASS deprecation warnings (pre-existing, not related to model changes)

### Key Learning
LocalDateTime fields from Java backend are serialized as ISO 8601 strings in JSON responses. Frontend models must use `string` type, not `Date`. This prevents silent deserialization failures where Angular assigns `undefined` to mismatched field names.

## Task 28: Role Guard & Error Interceptor

### Created Files
1. **role.guard.ts** - Functional guard that checks user roles from route.data['roles']
   - Uses `authService.hasRole(role)` to verify user has required role
   - Redirects to /dashboard if unauthorized
   - Allows any authenticated user if no roles specified

2. **error.interceptor.ts** - HTTP error handler with toast notifications
   - 401: Logs out user, redirects to /login, shows session expired message
   - 403: Shows access denied message
   - 404: Silent (let component handle)
   - 500: Shows server error message
   - 0: Shows connection error message
   - Other 4xx: Shows error.error.message or generic message

### Updated Files
- **app.config.ts**: Added errorInterceptor import and registered in withInterceptors([jwtInterceptor, errorInterceptor])

### Key Patterns
- Functional guards use `CanActivateFn` with `inject()` for dependency injection
- Functional interceptors use `HttpInterceptorFn` with `catchError()` for error handling
- NotificationService methods: `.success()`, `.error()`, `.info()`, `.warning()`
- Route data accessed via `route.data?.['roles']`

### Build Status
✅ `npx ng build --configuration=development` succeeds (only SASS deprecation warnings)
✅ No TypeScript errors in any files
✅ All imports resolve correctly

### Next Steps
- Task 29 will apply roleGuard to routes using route.data configuration

## Wave 0: Environment Configuration & Service Fixes (COMPLETED)

### What Was Done
1. **Created environment files** (`frontend/src/environments/`)
   - `environment.ts`: Development config with `http://localhost:8080/api`
   - `environment.prod.ts`: Production config with `/api`

2. **Updated angular.json**
   - Added `fileReplacements` in `architect.build.configurations.production` section
   - Maps development environment to production environment on build

3. **Fixed all 5 service files**
   - All services now import `environment` from `../../../environments/environment`
   - All hardcoded `http://localhost:8080` URLs replaced with `${environment.apiUrl}`
   - Removed incorrect endpoints and methods

4. **Service-specific fixes**
   - **auth.service.ts**: Updated apiUrl to use environment
   - **presence.service.ts**: 
     - Changed `/me` → `/mes-presences`
     - Fixed pointer() to use `PointageQRRequest { tokenQR }` (not `qrToken`)
     - Removed broken `justifier()` method
     - Added `getPresencesBySeance()` and `saisirManuel()` methods
   - **seance.service.ts**:
     - Changed `/me` → `/mes-seances`
     - Fixed generateQrCode() endpoint from `/qrcode` → `/qr`
     - Fixed response type from `{ token }` → `{ tokenQR }`
     - Added `getSeancesByGroupe()` method
   - **candidature.service.ts**:
     - Changed `/me` → `/mes-candidatures`
     - Added `getCandidaturesBySujet()` method
   - **sujet.service.ts**:
     - Added `getMesSujets()` method
     - Added `refuser()` method

### Build Status
✅ `npx ng build --configuration=development` succeeds with exit code 0
- Only SASS deprecation warnings (not errors)
- Output: `/Users/hatimbenzahra/Desktop/Me/isty-pfe-absences/frontend/dist/frontend`

### Key Learnings
- Environment configuration pattern: Use `environment.apiUrl` for all HTTP calls
- Backend endpoints verified against source: all 5 services now match backend routes
- Angular fileReplacements in angular.json handles environment swapping automatically
- All service methods now have correct endpoint paths and request/response types

### Next Steps (for other agents)
- Model files (presence.model.ts, seance.model.ts, etc.) need verification
- Components need to be updated to use new service methods
- Integration testing with backend at http://localhost:8080

## Wave 2 Model Files Created (2026-03-01)

### Files Created
1. **affectation.model.ts** - Mirrors AffectationDTO exactly
   - Fields: id, etudiantNom, sujetTitre, encadrantNom, statut, dateAffectation
   - Enum: StatutAffectation (EN_COURS, TERMINE, ABANDONNE)

2. **livrable.model.ts** - Mirrors LivrableDTO + LivrableCreateDTO
   - Livrable interface: id, type, titre, urlFichier, dateDepot
   - LivrableCreate interface: type, titre?, urlFichier, commentaire?
   - Enum: TypeLivrable (RAPPORT_INTERMEDIAIRE, RAPPORT_FINAL, CODE_SOURCE, PRESENTATION, AUTRE)

3. **justificatif.model.ts** - Mirrors JustificatifDTO + JustificatifCreateDTO
   - Justificatif interface: id, motif, urlFichier, statut, dateDepot, presenceId, commentaireValidation?
   - JustificatifCreate interface: presenceId, motif, urlFichier?
   - Enum: StatutJustificatif (EN_ATTENTE, ACCEPTE, REFUSE)

4. **statistiques.model.ts** - Mirrors StatistiquesDTO
   - Fields: totalSeances, totalPresent, totalAbsent, totalRetard, tauxAssiduite

### Verification
- ✅ All enum values match backend Java enums exactly
- ✅ All field names match DTOs exactly
- ✅ Build passes: `npx ng build --configuration=development` (Sass warnings only, acceptable)
- ✅ Files follow existing pattern (candidature.model.ts)

### Key Learnings
- TypeLivrable has 5 values (not 4 as initially suggested): RAPPORT_INTERMEDIAIRE, RAPPORT_FINAL, CODE_SOURCE, PRESENTATION, AUTRE
- All LocalDateTime fields converted to string (ISO format for JSON serialization)
- Optional fields marked with ? in TypeScript interfaces
- Enum values use SCREAMING_SNAKE_CASE matching Java backend

## Wave 1: Angular Services Created ✅

### Completed Tasks
1. ✅ Created `affectation.service.ts` with 5 methods:
   - `getMonPFE()` - GET /api/affectations/mon-pfe
   - `getMesEncadrements()` - GET /api/affectations/mes-encadrements
   - `affecterManuel(request)` - POST /api/affectations/manuelle
   - `affecterAuto()` - POST /api/affectations/automatique
   - `terminer(id)` - PUT /api/affectations/{id}/terminer

2. ✅ Created `livrable.service.ts` with 2 methods:
   - `getLivrablesByAffectation(affectationId)` - GET /api/livrables/affectation/{affectationId}
   - `submit(affectationId, livrable)` - POST /api/livrables/affectation/{affectationId}

### Key Decisions
- Used proper types from existing model files (Affectation, Livrable, LivrableCreate)
- Followed candidature.service.ts pattern exactly
- Used `environment.apiUrl` for all endpoints (no hardcoded URLs)
- Added `AffectationManuelleRequest` interface for request body typing
- Made `encadrantId` optional in AffectationManuelleRequest (matches backend @RequestParam(required = false))

### Build Status
- ✅ `npx ng build --configuration=development` passes
- No TypeScript errors on new services
- Only SASS deprecation warnings (pre-existing, not related to new code)

### Files Created
- `/frontend/src/app/core/services/affectation.service.ts` (39 lines)
- `/frontend/src/app/core/services/livrable.service.ts` (21 lines)


## Service Creation - 2026-03-01

### Created Services
1. **justificatif.service.ts** (33 lines)
   - Methods: submit(), getMesJustificatifs(), getAValider(), valider()
   - Uses JustificatifCreate and Justificatif models
   - valider() uses query params: accepter (boolean), commentaire (optional)

2. **statistiques.service.ts** (25 lines)
   - Methods: getByEtudiant(), getByGroupe(), getByMatiere()
   - Uses Statistiques model
   - All return Observable<Statistiques>

3. **export.service.ts** (32 lines)
   - Methods: exportCSV(), exportPDF()
   - Both use responseType: 'blob' for binary file downloads
   - Support optional date range params: debut, fin
   - groupe param is required

### Backend Endpoint Confirmations
- JustificatifController: valider uses query params (accepter, commentaire), not body
- StatistiquesController: export endpoints require groupe param, optional date range
- All endpoints confirmed against actual Java controller code

### Build Status
✅ `npx ng build --configuration=development` passes
- Only SASS deprecation warnings (not errors)
- Output: /frontend/dist/frontend

### TypeScript Validation
✅ All 3 services: No LSP errors

## [2026-03-01] Bug Fix: provideZonelessChangeDetection
- Added `provideZonelessChangeDetection()` to app.config.ts providers array
- Root cause: Angular 21 zoneless by default, HTTP callbacks update state but view never re-renders without scheduler
- Fix: provideZonelessChangeDetection() registers Angular's built-in scheduler
- Build status: ✅ PASS (exit code 0)

## [2026-03-01] Bug Fix: CD Trigger Interceptor
- Modified error.interceptor.ts to call queueMicrotask(() => appRef.tick()) after every HTTP response
- This triggers Angular change detection in zoneless mode (no zone.js)
- queueMicrotask ensures tick runs AFTER subscriber callbacks set loading=false
- Timing: tap fires → component's next() fires → microtask fires → appRef.tick() → DOM updates
- Build: PASS ✅

## [2026-03-01] Bug Fix: FINAL — ChangeDetectorRef.markForCheck() (THE CORRECT FIX)

### Previous Failed Approaches
1. **provideZonelessChangeDetection() alone** — NOT sufficient. It registers the scheduler but plain property assignment (`this.loading = false`) in subscribe callbacks doesn't notify it.
2. **appRef.tick() in interceptor** — Caused NG0100 (ExpressionChangedAfterChecked) errors in dev mode and STILL didn't update views because components weren't marked dirty.

### Root Cause (confirmed via Angular 21 official docs)
Angular 21 zoneless change detection triggers ONLY on:
- `ChangeDetectorRef.markForCheck()`
- Signal updates read in templates
- Template/host listener callbacks
- `ComponentRef.setInput`

HttpClient.subscribe() is a raw RxJS callback — Angular has ZERO visibility into it in zoneless mode.

### The Fix
- Inject `ChangeDetectorRef` via `private cdr = inject(ChangeDetectorRef)` in all 19 feature components
- Call `this.cdr.markForCheck()` as the last line in EVERY subscribe `next:` and `error:` callback
- 81 total markForCheck() calls across 19 files
- Reverted the interceptor hack (removed tap/HttpResponse/ApplicationRef/queueMicrotask)

### Results (Playwright verified)
- `/mes-presences` — 110ms, shows "Aucune présence enregistrée" ✅
- `/mes-justificatifs` — 100ms, shows "Aucun justificatif soumis" ✅
- `/sujets` — 102ms, shows "Aucun sujet disponible" ✅
- `/mes-candidatures` — 102ms, shows "Aucune candidature" ✅
- `/mon-pfe` — 99ms, shows "Aucune affectation" ✅
- 0 console errors (only expected 404 for mon-pfe)
- 0 NG0100 errors
- Build: ✅ PASS

### Key Learning
In Angular 21 zoneless mode, NEVER rely on plain property assignment to trigger view updates after async operations. Always use `markForCheck()` (migration bridge) or signals (recommended long-term). The `provideZonelessChangeDetection()` provider is necessary but NOT sufficient alone for subscribe-based code.

### Future Migration Path
Convert to signals + `toSignal()` from `@angular/core/rxjs-interop` for cleaner code. Or use `httpResource()` (experimental in Angular 21) for signal-native HTTP calls.
