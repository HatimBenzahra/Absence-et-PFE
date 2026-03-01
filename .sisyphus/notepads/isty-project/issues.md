# Issues - Projet ISTY PFE & Absences

## Problèmes Rencontrés
<!-- Les subagents doivent ajouter ici les problèmes rencontrés et leurs solutions -->


## Pre-existing Build Failures (2026-03-01)
Build fails due to errors in OTHER feature components (not scanner):
- `affectations.component.html:138` — TS2769 type mismatch (unknown[] vs string)  
- `statistiques.component.ts:127` — TS18047 possibly null
- Various missing .html/.scss stubs for incomplete components (populated by concurrent workers)
These cannot be fixed without modifying existing files. Scanner component itself is clean.

## Pre-existing missing stub files (2026-03-01)
Several feature components had their `.ts` files created with `styleUrls` / `templateUrl` references to `.scss`/`.html` files that didn't exist yet:
- `affectations/affectations.component.scss` — created stub
- `mes-encadrements/mes-encadrements.component.scss` — created stub  
- `gestion-presences/gestion-presences.component.scss` — created stub
These stubs were needed to unblock the build. The actual styles are implemented in the corresponding SCSS files by their respective tasks.
