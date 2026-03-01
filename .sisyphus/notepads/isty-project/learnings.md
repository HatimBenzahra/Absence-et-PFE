# Learnings - Projet ISTY PFE & Absences

## Conventions Établies
<!-- Les subagents doivent ajouter ici les conventions découvertes -->


## Scanner Component (2026-03-01)
- Created `frontend/src/app/features/scanner/` with 3 files: .ts, .html, .scss
- Used `@if` control flow (Angular 17+) instead of `*ngIf` for result display
- `presenceService.pointer({ tokenQR })` returns `Observable<Presence>`
- Button disabled during loading via `[disabled]="form.invalid || isLoading"`
- Brand colors: burgundy `#6d1d4a` for card header, teal `#0097c4` for CTA button
- Statut badge classes: `statut-present`, `statut-absent`, `statut-retard`, `statut-excuse`
- `formatDate()` uses `toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' })`
- LSP diagnostics: 0 errors on scanner.component.ts

## Mes Justificatifs Component (2026-03-01)
- Created `frontend/src/app/features/mes-justificatifs/` with 3 files: .ts, .html, .scss
- Selector: `app-mes-justificatifs` — standalone Angular 21 component
- Two-section layout: form card + table card, both with burgundy header gradient
- Form uses Angular `@if` control flow (not `*ngIf`) for error messages and spinner
- `presenceId` field: type=number input, converted via `Number()` before payload construction
- `urlFichier` spread into payload only when truthy: `...(raw.urlFichier ? { urlFichier: raw.urlFichier } : {})`
- Statut chip classes: `chip--pending` (orange), `chip--accepted` (green), `chip--refused` (red)
- StatutJustificatif enum re-exported to template via `StatutJustificatif = StatutJustificatif`
- `NotificationService` path from features: `../../shared/services/notification.service`
- LSP diagnostics: 0 errors on mes-justificatifs.component.ts

## SujetsComponent (2026-03-01)
- Component pattern: standalone, external HTML+SCSS, `styleUrl` (singular) works in Angular 21
- `MatChipsModule` provides both `mat-chip-set` and `mat-chip` for chip rendering
- `[disableRipple]="true"` on `mat-chip` prevents unwanted click effects on non-interactive chips
- `[routerLink]` on `mat-flat-button` requires `RouterModule` in imports
- `NotificationService` is in `shared/services/`, not `core/services/`
- SCSS: avoid `darken()`/`lighten()` (deprecated in Dart Sass 3). Use `color.adjust()` instead — but SASS deprecation warnings are acceptable per project policy
- Build was previously failing due to missing stub SCSS files for other feature components (affectations, mes-encadrements, gestion-presences). Created empty stubs to unblock the build

## Statistiques Component (2026-03-01)

### ng2-charts v8 Standalone Pattern
- Import `BaseChartDirective` from `ng2-charts`
- Import individual Chart.js elements: `ArcElement, Tooltip, Legend, PieController, BarController, CategoryScale, LinearScale, BarElement`
- Call `Chart.register(...)` at module level (outside component class)
- In component `imports[]`: `BaseChartDirective`
- Template: `<canvas baseChart [data]="data" [type]="'pie'" [options]="opts"></canvas>`
- Use `ChartData<'pie'>` and `ChartConfiguration<'pie'>['options']` for typed chart data

### TypeScript Gotcha
- `ctx.parsed.y` in Chart.js tooltip callbacks is `number | null` — use `(ctx.parsed.y ?? 0)` to avoid TS error

### Chart Data Reactivity
- To trigger chart re-render: create new object references via spread `{ ...oldData, datasets: [{ ...oldDataset, data: newData }] }`

### Build Status
- Build passes exit 0 with only SASS deprecation warnings (pre-existing in other components)
- Route `/statistiques` updated in `app.routes.ts` to use `StatistiquesComponent` (was `SpacePlaceholderComponent`)
