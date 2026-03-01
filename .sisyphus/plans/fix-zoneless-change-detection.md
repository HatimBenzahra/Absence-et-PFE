# Fix: Infinite Loading Spinner (Zoneless Change Detection)

## TL;DR

> **Quick Summary**: Angular 21 runs zoneless by default but `app.config.ts` is missing the `provideZonelessChangeDetection()` provider. Without it, change detection never fires after HTTP responses, causing all pages to show infinite loading spinners when data is empty (or present).
> 
> **Deliverables**:
> - Fix `app.config.ts` — add `provideZonelessChangeDetection()`
> - Verify all 17 pages load correctly with empty data
> 
> **Estimated Effort**: Quick (single line fix + verification)
> **Parallel Execution**: NO — single sequential fix
> **Critical Path**: Task 1 (fix) → Task 2 (verify)

---

## Context

### Bug Report
User reported: "quand ca fetch data, et que y a rien, ca prends bcp de temps a charger, meme si le packet backend est deja la"

### Root Cause Analysis (COMPLETED)
1. **Backend is NOT the problem** — all endpoints respond in <10ms with correct `200 []` responses
2. **Interceptors are NOT the problem** — JWT interceptor adds Bearer token cleanly, error interceptor passes through correctly
3. **Component code is NOT the problem** — all 16+ components set `loading = false` in both `next` and `error` subscribe handlers
4. **THE ACTUAL BUG**: Angular 21 with `@angular/build:application` builder runs **zoneless by default**. The `app.config.ts` has:
   - `provideBrowserGlobalErrorListeners()` ✅
   - `provideRouter(routes)` ✅
   - `provideHttpClient(withInterceptors([...]))` ✅
   - `provideAnimations()` ✅
   - **NO change detection provider** ❌ ← THIS IS THE BUG

5. **Proof via Playwright**:
   - Navigated to `/mes-presences` after login
   - Network shows `GET /api/presences/mes-presences => [200]` completed
   - `window.ng.getComponent()` shows `{loading: false, presencesLength: 0}` — state IS correct
   - But DOM still shows spinner with "Chargement des présences…" after 20+ seconds
   - **Change detection never fires because no zone scheduler is configured**

### Why This Affects ALL Pages
Every page that makes HTTP calls has the same pattern:
```typescript
ngOnInit(): void {
  this.service.getData().subscribe({
    next: (data) => { this.data = data; this.loading = false; },
    error: () => { this.loading = false; }
  });
}
```
The subscribe callback runs (verified), `loading` becomes `false`, but Angular never re-renders the template.

---

## Work Objectives

### Core Objective
Add `provideZonelessChangeDetection()` to `app.config.ts` to enable Angular's built-in change detection scheduler.

### Must Have
- `provideZonelessChangeDetection()` in providers array
- All pages resolve loading state within 1 second of data arrival

### Must NOT Have
- Do NOT add zone.js (Angular 21 is zoneless by design)
- Do NOT add `ChangeDetectorRef.markForCheck()` to every component (the provider fixes this globally)
- Do NOT modify any component files

---

## Verification Strategy

### QA Policy
Agent-executed via Playwright after fix.

---

## TODOs

- [x] 1. Add provideZonelessChangeDetection() to app.config.ts

  **What to do**:
  - Open `frontend/src/app/app.config.ts`
  - Add `provideZonelessChangeDetection` to the import from `@angular/core`:
    ```typescript
    import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
    ```
  - Add `provideZonelessChangeDetection()` to the providers array:
    ```typescript
    export const appConfig: ApplicationConfig = {
      providers: [
        provideBrowserGlobalErrorListeners(),
        provideRouter(routes),
        provideHttpClient(withInterceptors([jwtInterceptor, errorInterceptor])),
        provideAnimations(),
        provideZonelessChangeDetection()
      ]
    };
    ```

  **Must NOT do**:
  - Do NOT install zone.js
  - Do NOT modify any other files
  - Do NOT add ChangeDetectorRef to components

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Blocks**: Task 2

  **References**:
  - `frontend/src/app/app.config.ts` — THE file to modify (currently 17 lines)
  - Angular 21 docs: `provideZonelessChangeDetection()` enables the built-in scheduler

  **Acceptance Criteria**:
  - [ ] `provideZonelessChangeDetection` imported from `@angular/core`
  - [ ] `provideZonelessChangeDetection()` present in providers array
  - [ ] `npx ng build --configuration=development` → 0 errors

  **QA Scenarios**:
  ```
  Scenario: Build succeeds after change
    Tool: Bash
    Steps:
      1. cd frontend && npx ng build --configuration=development
    Expected Result: Build completes with 0 errors
    Evidence: .sisyphus/evidence/task-1-build.txt
  ```

  **Commit**: YES
  - Message: `fix(core): add provideZonelessChangeDetection to fix infinite loading spinners`
  - Files: `frontend/src/app/app.config.ts`

---

- [x] 2. Verify all pages load correctly via Playwright (+ added ChangeDetectorRef.markForCheck to all 19 components)

  **What to do**:
  - Login with `hatimcrops@gmail.com` / `12345678` via Playwright
  - Navigate to each of these pages and verify spinner resolves to content/empty state within 2 seconds:
    1. `/mes-presences` — should show "Aucune présence enregistrée"
    2. `/mes-justificatifs` — should show empty state
    3. `/sujets` — should show empty state
    4. `/mes-candidatures` — should show empty state
    5. `/mon-pfe` — should show "no affectation" state (handles 404)
  - Also verify `/dashboard` loads correctly (already confirmed working pre-fix)

  **Must NOT do**:
  - Do NOT modify any component code
  - Do NOT skip any page

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: `[playwright]`

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Blocked By**: Task 1

  **References**:
  - Login: `hatimcrops@gmail.com` / `12345678` (role: ETUDIANT)
  - Backend endpoints all return `[]` or 404 (empty database)
  - Each page has `@if (loading)` spinner and `@if (!loading)` content/empty state

  **Acceptance Criteria**:
  - [ ] All 5 student pages resolve loading within 2 seconds
  - [ ] No console errors on any page
  - [ ] Empty state messages displayed correctly

  **QA Scenarios**:
  ```
  Scenario: Mes Présences loads with empty data
    Tool: Playwright
    Steps:
      1. Navigate to http://localhost:4200/login
      2. Fill email: hatimcrops@gmail.com, password: 12345678
      3. Click "Se connecter"
      4. Navigate to /mes-presences
      5. Wait max 3 seconds for "Aucune présence" text to appear
    Expected Result: "Aucune présence enregistrée" visible, no spinner
    Evidence: .sisyphus/evidence/task-2-mes-presences.png

  Scenario: Sujets page loads with empty data
    Tool: Playwright
    Steps:
      1. Navigate to /sujets
      2. Wait max 3 seconds for content to load
    Expected Result: Empty state or "Aucun sujet" message visible, no spinner
    Evidence: .sisyphus/evidence/task-2-sujets.png

  Scenario: Mon PFE handles 404 gracefully
    Tool: Playwright
    Steps:
      1. Navigate to /mon-pfe
      2. Wait max 3 seconds for content to load
    Expected Result: "Pas d'affectation" or similar message, no infinite spinner
    Evidence: .sisyphus/evidence/task-2-mon-pfe.png
  ```

  **Commit**: NO (no code changes)

---

## Success Criteria

### Verification Commands
```bash
cd frontend && npx ng build --configuration=development  # Expected: 0 errors
```

### Final Checklist
- [x] `provideZonelessChangeDetection()` in app.config.ts
- [x] All pages resolve loading state within 2 seconds
- [x] No console errors
- [x] Build passes
